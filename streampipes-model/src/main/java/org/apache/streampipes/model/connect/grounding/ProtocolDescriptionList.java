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

package org.apache.streampipes.model.connect.grounding;


import io.fogsy.empire.annotations.Namespaces;
import io.fogsy.empire.annotations.RdfProperty;
import io.fogsy.empire.annotations.RdfsClass;
import org.apache.streampipes.model.base.NamedStreamPipesEntity;
import org.apache.streampipes.model.shared.annotation.TsModel;
import org.apache.streampipes.vocabulary.StreamPipes;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Namespaces({"sp", "https://streampipes.org/vocabulary/v1/"})
@RdfsClass("sp:ProtocolDescriptionList")
@Entity
@TsModel
public class ProtocolDescriptionList extends NamedStreamPipesEntity {

    @OneToMany(fetch = FetchType.EAGER,
            cascade = {CascadeType.ALL})
    @RdfProperty("sp:list")
    private List<ProtocolDescription> list;
//    private List<StaticProperty> list;

    @RdfProperty("rdfs:label")
    protected String label;

    public ProtocolDescriptionList() {
        super("http://bla.de#1", "", "");
        list = new ArrayList<>();
    }

    public ProtocolDescriptionList(List<ProtocolDescription> protocolDescriptions) {
        super("http://bla.de#1", "", "");
        list = protocolDescriptions;
    }

    public void addDesctiption(ProtocolDescription protocolDescription) {
        list.add(protocolDescription);
    }

    public List<ProtocolDescription> getList() {
        return list;
    }

    public void setList(List<ProtocolDescription> list) {
        this.list = list;
    }


}
