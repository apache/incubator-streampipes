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

export default function iconProviderConfig($mdIconProvider, apiConstants) {
	const getServerUrl = () => {
		return apiConstants.contextPath + apiConstants.api;
		//return "http://localhost:8080";
	};

	$mdIconProvider
		.iconSet('action', 'assets/img/svg/svg-sprite-action.svg', 24)
		.iconSet('alert', 'assets/img/svg/svg-sprite-alert.svg', 24)
		.iconSet('av', 'assets/img/svg/svg-sprite-av.svg', 24)
		.iconSet('communication', 'assets/img/svg/svg-sprite-communication.svg', 24)
		.iconSet('content', 'assets/img/svg/svg-sprite-content.svg', 24)
		.iconSet('device', 'assets/img/svg/svg-sprite-device.svg', 24)
		.iconSet('editor', 'assets/img/svg/svg-sprite-editor.svg', 24)
		.iconSet('file', 'assets/img/svg/svg-sprite-file.svg', 24)
		.iconSet('hardware', 'assets/img/svg/svg-sprite-hardware.svg', 24)
		.iconSet('image', 'assets/img/svg/svg-sprite-image.svg', 24)
		.iconSet('maps', 'assets/img/svg/svg-sprite-maps.svg', 24)
		.iconSet('navigation', 'assets/img/svg/svg-sprite-navigation.svg', 24)
		.iconSet('notification', 'assets/img/svg/svg-sprite-notification.svg', 24)
		.iconSet('social', 'assets/img/svg/svg-sprite-social.svg', 24)
		.iconSet('toggle', 'assets/img/svg/svg-sprite-toggle.svg', 24)
		.iconSet('avatars', 'assets/img/svg/avatar-icons.svg', 24)
		.iconSet('filter_alt', 'assets/img/svg/filter_alt.svg', 24)
		.defaultIconSet('assets/img/svg/svg-sprite-action.svg', 24);
};

iconProviderConfig.$inject = ['$mdIconProvider', 'apiConstants'];
