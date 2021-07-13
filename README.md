<!--
  ~ Licensed to the Apache Software Foundation (ASF) under one or more
  ~ contributor license agreements.  See the NOTICE file distributed with
  ~ this work for additional information regarding copyright ownership.
  ~ The ASF licenses this file to You under the Apache License, Version 2.0
  ~ (the "License"); you may not use this file except in compliance with
  ~ the License.  You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  ~
  -->

[![Github Actions](https://img.shields.io/github/workflow/status/apache/incubator-streampipes/build-and-deploy-docker-dev)](https://github.com/apache/incubator-streampipes/actions/)
[![Docker pulls](https://img.shields.io/docker/pulls/apachestreampipes/backend.svg)](https://hub.docker.com/r/apachestreampipes/backend/)
[![Maven central](https://img.shields.io/maven-central/v/org.apache.streampipes/streampipes-backend.svg)](https://img.shields.io/maven-central/v/org.apache.streampipes/streampipes-backend.svg)
[![License](https://img.shields.io/github/license/apache/incubator-streampipes.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Last commit](https://img.shields.io/github/last-commit/apache/incubator-streampipes.svg)]()
[![SourceSpy Dashboard](https://sourcespy.com/shield.svg)](https://sourcespy.com/github/apacheincubatorstreampipes/)
[![Twitter](https://img.shields.io/twitter/follow/StreamPipes.svg?label=Follow&style=social)](https://twitter.com/StreamPipes)

<h1 align="center">
  <br>
   <img src="https://streampipes.apache.org/img/sp-logo-color.png" 
   alt="StreamPipes Logo" title="Apache StreamPipes Logo" width="50%"/>
  <br>
</h1>
<h3 align="center">Self-Service Data Analytics for the (Industrial) IoT</h3>
<h4 align="center">StreamPipes is a self-service (Industrial) IoT toolbox to enable non-technical users to connect
, analyze and explore IoT data streams. </h4>
<p align="center">  
    <img src="https://streampipes.apache.org/img/screenshots/streampipes-overview.png" alt="StreamPipes Pipeline
     Editor"/>
</p>

***

## Table of contents

  * [About Apache StreamPipes](#about-apache-streampipes)
  * [Use Cases](#use-cases)
  * [Installation](#installation)
  * [Building StreamPipes](#building-streampipes)
  * [Pipeline Elements](#pipeline-elements)  
  * [Extending StreamPipes](#extending-streampipes)
  * [Bugs and Feature Requests](#bugs-and-feature-requests)
  * [Get help](#get-help)
  * [Contribute](#contribute)
  * [Feedback](#feedback)
  * [License](#license)

***

## About Apache StreamPipes

Apache StreamPipes (incubating) enables flexible modeling of stream processing pipelines by providing a graphical 
modeling editor on top of existing stream processing frameworks.

It empowers non-technical users to quickly define and execute processing pipelines based on an easily extensible 
toolbox of data sources, data processors and data sinks. StreamPipes has an exchangeable runtime execution layer and 
executes pipelines using one of the provided wrappers, e.g., standalone or distributed in Apache Flink.

Pipeline elements in StreamPipes can be installed at runtime - the built-in SDK allows to easily implement new 
pipeline elements according to your needs. Pipeline elements are standalone microservices that can run anywhere - 
centrally on your server, in a large-scale cluster or close at the edge.

## Use Cases

StreamPipes allows you to connect IoT data sources using the SDK or the built-in graphical tool **StreamPipes 
Connect**.

The extensible toolbox of data processors and sinks supports use cases such as
* Continuously **store** IoT data streams to third party systems (e.g., databases)
* **Filter** measurements on streams (e.g., based on thresholds or value ranges)
* **Harmonize** data by using data processors for transformations (e.g., by converting measurement units and data types
 or by aggregating measurements)
* **Detect situations** that should be avoided (e.g., patterns based on time windows)
* Wrap **Machine Learning models** into data processors to perform classifications or predictions on sensor and image data
* **Visualize** real-time data from sensors and machines using the built-in Live Dashboard


## Installation

The quickest way to run StreamPipes including the latest extensions (adapters, pipeline elements) is by using our Docker-based [installation & operation options](https://www.github.com/apache/incubator-streampipes-installer), namely: 

* **[StreamPipes Compose](https://github.com/apache/incubator-streampipes-installer/tree/master/compose)** - The User's Choice
* **[StreamPipes CLI](https://github.com/apache/incubator-streampipes-installer/tree/master/cli)** - The Developer's Favorite
* **[StreamPipes k8s](https://github.com/apache/incubator-streampipes-installer/tree/master/k8s)** - The Operator's Dream

> **NOTE**: StreamPipes CLI & k8s are highly recommended for developers or operators. Standard users should stick to StreamPipes Compose.

Please follow the instructions provided in the corresponding `README.md` to get started.

For a more in-depth manual, read the [installation guide](https://streampipes.apache.org/docs/docs/try-installation.html).

## Building StreamPipes

To properly build the StreamPipes core, the following tools should be installed:

### Prerequisites
* Java 8 JDK (minimum)
* Maven (tested with 3.6)
* NodeJS + NPM (tested with v12+/ v6+)
* Docker + Docker-Compose

### Building

To build the core project, do the following:

```
    mvn clean package
```

To build the ui, switch to the ``ui`` folder and perform the following steps:

```
    npm install
    npm run build
```

### Starting

To start StreamPipes, run ``docker-compose up -d`` from the root directory.

You can also use the installer or CLI as described in the ``Installation`` section.

## Pipeline Elements
StreamPipes includes a repository of extensions for
* **Connect adapters** for a variety of IoT data sources as well as 
* **Data Processors** and **Data Sinks** as ready-to-use pipeline elements. 

A description of the standard elements can be found in the Github repository [streampipes-extensions](https://www.github.com/apache/incubator-streampipes-extensions).

## Extending StreamPipes

You can easily add your own data streams, processors or sinks. A [Java-based SDK](https://streampipes.apache.org/docs/docs/dev-guide-tutorial-processors) and several [run-time wrappers](https://streampipes.apache.org/docs/docs/dev-guide-architecture) for popular streaming frameworks such as Apache Flink, Apache Spark and Apache 
Kafka Streams (and also plain Java programs) can be used to integrate your existing processing logic into StreamPipes. Pipeline elements are packaged as Docker images and can be installed at runtime, whenever your requirements change.

Check our developer guide at [https://streampipes.apache.org/docs/docs/dev-guide-introduction](https://streampipes.apache.org/docs/docs/dev-guide-introduction).

## Bugs and Feature Requests

If you've found a bug or have a feature that you'd love to see in StreamPipes, feel free to create an issue in our Jira:
[https://issues.apache.org/jira/projects/STREAMPIPES](https://issues.apache.org/jira/projects/STREAMPIPES)

## Get help

If you have any problems during the installation or questions around StreamPipes, you'll get help through one of our 
community channels:

- [Mailing Lists](https://streampipes.apache.org/mailinglists.html)

And don't forget to follow us on [Twitter](https://twitter.com/streampipes)!

## Contribute

We welcome contributions to StreamPipes. If you are interested in contributing to StreamPipes, let us know! You'll
 get to know an open-minded and motivated team working together to build the next IIoT analytics toolbox.

Here are some first steps in case you want to contribute:
* Subscribe to our dev mailing list [dev-subscribe@streampipes.apache.org](dev-subscribe@streampipes.apache.org)
* Send an email, tell us about your interests and which parts of Streampipes you'd like to contribute (e.g., core or UI)!
* Ask for a mentor who helps you understanding the code base and guides you through the first setup steps
* Find an issue in our [Jira](https://issues.apache.org/jira/projects/STREAMPIPES) which is tagged with a _newbie_ tag
* Have a look at our developer wiki at [https://cwiki.apache.org/confluence/display/STREAMPIPES](https://cwiki.apache.org/confluence/display/STREAMPIPES) to learn more about StreamPipes development.

Have fun!

## Feedback

We'd love to hear your feedback! Subscribe to [users@streampipes.apache.org](mailto:users@streampipes.apache.org)

## License

[Apache License 2.0](LICENSE)
