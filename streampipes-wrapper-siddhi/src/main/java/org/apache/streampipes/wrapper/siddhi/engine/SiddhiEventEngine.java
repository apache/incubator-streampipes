/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package org.apache.streampipes.wrapper.siddhi.engine;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.streampipes.model.graph.DataProcessorInvocation;
import org.apache.streampipes.model.runtime.EventFactory;
import org.apache.streampipes.model.runtime.SchemaInfo;
import org.apache.streampipes.model.runtime.SourceInfo;
import org.apache.streampipes.wrapper.context.EventProcessorRuntimeContext;
import org.apache.streampipes.wrapper.params.binding.EventProcessorBindingParams;
import org.apache.streampipes.wrapper.routing.SpOutputCollector;
import org.apache.streampipes.wrapper.runtime.EventProcessor;
import org.apache.streampipes.wrapper.siddhi.manager.SpSiddhiManager;
import io.siddhi.core.SiddhiAppRuntime;
import io.siddhi.core.SiddhiManager;
import io.siddhi.core.event.Event;
import io.siddhi.core.stream.input.InputHandler;
import io.siddhi.core.stream.output.StreamCallback;

import java.util.*;

public abstract class SiddhiEventEngine<B extends EventProcessorBindingParams> implements
        EventProcessor<B> {

  private StringBuilder siddhiAppString;

  private SiddhiAppRuntime siddhiAppRuntime;
  private Map<String, InputHandler> siddhiInputHandlers;
  private List<String> inputStreamNames;

  private Map<String, List> listOfEventKeys;
  private List<String> outputEventKeys;

  private Boolean debugMode;
  private SiddhiDebugCallback debugCallback;

  private String timestampField;

  private static final Logger LOG = LoggerFactory.getLogger(SiddhiEventEngine.class);

  public SiddhiEventEngine() {
    this.siddhiAppString = new StringBuilder();
    this.siddhiInputHandlers = new HashMap<>();
    this.inputStreamNames = new ArrayList<>();
    listOfEventKeys = new HashMap<>();
    outputEventKeys = new ArrayList<>();
    this.debugMode = false;
  }

  public SiddhiEventEngine(SiddhiDebugCallback debugCallback) {
    this();
    this.debugCallback = debugCallback;
    this.debugMode = true;
  }

  @Override
  public void onInvocation(B parameters, SpOutputCollector spOutputCollector, EventProcessorRuntimeContext runtimeContext) {
    if (parameters.getInEventTypes().size() != parameters.getGraph().getInputStreams().size()) {
      throw new IllegalArgumentException("Input parameters do not match!");
    }

    SiddhiManager siddhiManager = SpSiddhiManager.INSTANCE.getSiddhiManager();

    this.timestampField = removeStreamIdFromTimestamp(setTimestamp(parameters));

    LOG.info("Configuring event types for graph " + parameters.getGraph().getName());
    parameters.getInEventTypes().forEach((key, value) -> {
      // TODO why is the prefix not in the parameters.getInEventType
      registerEventTypeIfNotExists(key, value);
      this.inputStreamNames.add(prepareName(key));
    });

    LOG.info("Configuring output event keys for graph " + parameters.getGraph().getName());
    //System.out.println("output key: " + key);
    outputEventKeys.addAll(parameters.getOutEventType().keySet());

    String fromStatement = fromStatement(inputStreamNames, parameters);
    String selectStatement = selectStatement(parameters);
    registerStatements(fromStatement, selectStatement, getOutputTopicName(parameters));

    siddhiAppRuntime = siddhiManager.createSiddhiAppRuntime(siddhiAppString.toString());
    parameters
            .getInEventTypes()
            .forEach((key, value) -> siddhiInputHandlers.put(key, siddhiAppRuntime.getInputHandler(prepareName(key))));

    if (!debugMode) {
      siddhiAppRuntime.addCallback(prepareName(getOutputTopicName(parameters)), new StreamCallback() {
        @Override
        public void receive(Event[] events) {
          if (events.length > 0) {
            Event lastEvent = events[events.length - 1];
            spOutputCollector.collect(toSpEvent(lastEvent, parameters,
                    runtimeContext.getOutputSchemaInfo
                    (), runtimeContext.getOutputSourceInfo()));
          }
        }
      });
    } else {
      siddhiAppRuntime.addCallback(prepareName(getOutputTopicName(parameters)), new StreamCallback() {
        @Override
        public void receive(Event[] events) {
          LOG.info("Siddhi is firing");
          if (events.length > 0) {
            SiddhiEventEngine.this.debugCallback.onEvent(events[events.length - 1]);
          }
        }
      });
    }

    siddhiAppRuntime.start();

  }

  private String removeStreamIdFromTimestamp(String timestampField) {
    return timestampField !=null ? timestampField.replaceAll("s.::", "") : null;
  }

  private String getOutputTopicName(B parameters) {
    return parameters
            .getGraph()
            .getOutputStream()
            .getEventGrounding()
            .getTransportProtocol()
            .getTopicDefinition()
            .getActualTopicName();
  }

  private org.apache.streampipes.model.runtime.Event toSpEvent(Event event, B parameters, SchemaInfo
          schemaInfo, SourceInfo sourceInfo) {
    Map<String, Object> outMap = new HashMap<>();
    for (int i = 0; i < outputEventKeys.size(); i++) {

      if (event.getData(i) instanceof LinkedList) {
        List<Object> tmp = (List<Object>) event.getData(i);
        outMap.put(outputEventKeys.get(i), tmp.get(0));
      }
      else {
        outMap.put(outputEventKeys.get(i), event.getData(i));
      }

    }
    return EventFactory.fromMap(outMap, sourceInfo, schemaInfo);
  }


  private void registerEventTypeIfNotExists(String eventTypeName, Map<String, Object> typeMap) {
    String defineStreamPrefix = "define stream " + prepareName(eventTypeName);
    StringJoiner joiner = new StringJoiner(",");
    int currentNoOfStreams = this.listOfEventKeys.size();

    List<String> sortedEventKeys = new ArrayList<>();
    for (String key : typeMap.keySet()) {
      sortedEventKeys.add(key);
      Collections.sort(sortedEventKeys);
    }

    listOfEventKeys.put(eventTypeName, sortedEventKeys);

    for (String key : sortedEventKeys) {
      // TODO: get timestamp field from user params
      if(key.equalsIgnoreCase(this.timestampField)) {
        joiner.add("s" + currentNoOfStreams + key + " LONG");
      }
      else {
        joiner.add("s" + currentNoOfStreams + key + " " + toType((Class<?>) typeMap.get(key)));
      }
    }

    this.siddhiAppString.append(defineStreamPrefix);
    this.siddhiAppString.append("(");
    this.siddhiAppString.append(joiner.toString());
    this.siddhiAppString.append(");\n");
  }

  private String toType(Class<?> o) {
    if (o.equals(Long.class)) {
      return "LONG";
    } else if (o.equals(Integer.class)) {
      return "INT";
    } else if (o.equals(Double.class)) {
      return "DOUBLE";
    } else if (o.equals(Float.class)) {
      return "DOUBLE";
    } else if (o.equals(Boolean.class)) {
      return "BOOL";
    } else {
      return "STRING";
    }
  }

  private void registerStatements(String fromStatement, String selectStatement, String outputStream) {
    this.siddhiAppString.append(fromStatement)
            .append("\n")
            .append(selectStatement)
            .append("\n")
            .append("insert into ")
            .append(prepareName(outputStream))
            .append(";");

    LOG.info("Registering statement: \n" + this.siddhiAppString.toString());

  }

  @Override
  public void onEvent(org.apache.streampipes.model.runtime.Event event, SpOutputCollector collector) {
    try {
      String sourceId = event.getSourceInfo().getSourceId();
      InputHandler inputHandler = siddhiInputHandlers.get(sourceId);
      List<String> eventKeys = listOfEventKeys.get(sourceId);

      inputHandler.send(toObjArr(eventKeys, event.getRaw()));
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  private Object[] toObjArr(List<String> eventKeys, Map<String, Object> event) {
    Object[] result = new Object[eventKeys.size()];
    for (int i = 0; i < eventKeys.size(); i++) {
      result[i] = event.get(eventKeys.get(i));
    }

    return result;
  }

  @Override
  public void onDetach() {
    this.siddhiAppRuntime.shutdown();
  }

  protected abstract String fromStatement(List<String> inputStreamNames, final B bindingParameters);

  protected abstract String selectStatement(final B bindingParameters);

  protected String setTimestamp(final B bindingparameters) {
    return null;
  }

  protected String prepareName(String eventName) {
    return eventName
            .replaceAll("\\.", "")
            .replaceAll("-", "")
            .replaceAll("::", "");
  }



  protected String getCustomOutputSelectStatement(DataProcessorInvocation invocation,
                                                  String eventName) {
    StringBuilder selectString = new StringBuilder();
    selectString.append("select ");

    if (outputEventKeys.size() > 0) {
      for (int i = 0; i < outputEventKeys.size() - 1; i++) {
        selectString.append(eventName + ".s0" + outputEventKeys.get(i) + ",");
      }
      selectString.append(eventName + ".s0" + outputEventKeys.get(outputEventKeys.size() - 1));

    }

    return selectString.toString();
  }

//  protected String getCustomOutputSelectStatement(DataProcessorInvocation invocation) {
//    return getCustomOutputSelectStatement(invocation, "e1");
//  }

  protected String getCustomOutputSelectStatement(DataProcessorInvocation invocation) {
    StringBuilder selectString = new StringBuilder();
    selectString.append("select ");

    if (outputEventKeys.size() > 0) {
      for (int i=0; i<outputEventKeys.size() - 1; i++) {
        selectString.append("s0" + outputEventKeys.get(i) + ",");
      }
      selectString.append("s0" + outputEventKeys.get(outputEventKeys.size() - 1));
    }
    return selectString.toString();
  }

  protected String getCustomOutputSelectStatement(DataProcessorInvocation invocation, int streamNumber) {
    return getCustomOutputSelectStatement(invocation, null, streamNumber);
  }
  protected String getCustomOutputSelectStatement(DataProcessorInvocation invocation,
                                                  String eventName,
                                                  int streamNumber) {
    StringBuilder selectString = new StringBuilder();
    selectString.append("select ");
    String prefix = (eventName == null) ? "s" + streamNumber : eventName + ".s" + streamNumber;

    if (outputEventKeys.size() > 0) {
      for (int i = 0; i < outputEventKeys.size() - 1; i++) {
        selectString.append(prefix + outputEventKeys.get(i) + ",");
      }
      selectString.append(prefix + outputEventKeys.get(outputEventKeys.size() - 1));

    }
    return selectString.toString();
  }

  public void setSortedEventKeys(List<String> sortedEventKeys) {
    String streamId = (String) this.listOfEventKeys.keySet().toArray()[0];    // only reliable if there is only one stream, else use changeEventKeys() to respective streamId
    changeEventKeys(streamId, sortedEventKeys);
  }

  public void changeEventKeys(String streamId, List<String> newEventKeys) {
    this.listOfEventKeys.put(streamId, newEventKeys);
  }
}
