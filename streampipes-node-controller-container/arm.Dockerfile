# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

ARG BASE_IMAGE=arm32v7/openjdk:11-jre-slim
FROM $BASE_IMAGE

ENV CONSUL_LOCATION consul
ENV NODE_INFO_YAML_FILE node_info.yml

EXPOSE 7077

COPY qemu-arm-static /usr/bin
COPY target/streampipes-node-controller-container.jar  /streampipes-node-controller.jar

ENTRYPOINT ["java", "-jar", "/streampipes-node-controller.jar"]