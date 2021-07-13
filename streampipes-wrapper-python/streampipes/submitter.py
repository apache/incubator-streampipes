#
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
#
import abc

from streampipes.api.rest import PipelineElementApi
from streampipes.base.banner import banner
from streampipes.declarer import DeclarerSingleton
from streampipes.model.pipeline_element_config import Config
from streampipes.utils.register import ConsulUtils


class StandaloneModelSubmitter(object):
    __metaclass__ = abc.ABC

    @classmethod
    def init(cls, config: Config):
        # print banner
        print(banner)
        # add host to declarer singleton
        DeclarerSingleton().host = config.host
        DeclarerSingleton().port = config.port
        # start api
        PipelineElementApi().run(port=config.port)
        # register pipeline element config and service
        ConsulUtils().register_configs(config=config)
        ConsulUtils().register_service(app_id=config.app_id, host=config.host, port=int(config.port))

    # TODO: delete later
    @classmethod
    def init_debug(cls, config: Config):
        # print banner
        print(banner)
        # add host to declarer singleton
        DeclarerSingleton().host = config.host
        DeclarerSingleton().port = config.port
        # start api
        PipelineElementApi().run(port=config.port)

