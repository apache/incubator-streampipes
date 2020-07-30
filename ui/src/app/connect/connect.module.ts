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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';

import { ConnectComponent } from './connect.component';
import { NewAdapterComponent } from './new-adapter/new-adapter.component';

import { FormatFormComponent } from './format-form/format-form.component';
import { SelectProtocolComponent } from './select-protocol-component/select-protocol.component';

import { EventPropertyPrimitiveComponent } from './schema-editor/event-property-primitive/event-property-primitive.component';
import { EventPropertyComponent } from './schema-editor/event-property/event-property.component';
import { EventSchemaComponent } from './schema-editor/event-schema/event-schema.component';

import { StaticPropertyComponent } from './static-properties/static-property.component';

import { CustomMaterialModule } from '../CustomMaterial/custom-material.module';

import { RestService } from './rest.service';

import { MatInputModule } from '@angular/material/input';
import { DragulaModule } from 'ng2-dragula';
import { AdapterStartedDialog } from './new-adapter/component/adapter-started-dialog.component';
import { DataTypesService } from './schema-editor/data-type.service';
import { StaticFreeInputComponent } from './static-properties/static-free-input/static-free-input.component';
import { StaticNumberInputComponent } from './static-properties/static-number-input/static-number-input.component';
import { StaticPropertyUtilService } from './static-properties/static-property-util.service';
import { StaticSecretInputComponent } from './static-properties/static-secret-input/static-secret-input.component';
import { StaticTextInputComponent } from './static-properties/static-text-input/static-text-input.component';
import { StaticUrlInputComponent } from './static-properties/static-url-input/static-url-input.component';
import { TransformationRuleService } from './transformation-rule.service';

import { ProtocolComponent } from './protocol-component/protocol.component';

import { ShepherdService } from '../services/tour/shepherd.service';
import { ConnectService } from './connect.service';
import { AdapterDescriptionComponent } from './data-marketplace/adapter-description/adapter-description.component';
import { DataMarketplaceComponent } from './data-marketplace/data-marketplace.component';
import { DataMarketplaceService } from './data-marketplace/data-marketplace.service';
import { FileManagementComponent } from './file-management/file-management.component';
import { FileRestService } from './file-management/service/filerest.service';
import { FormatComponent } from './format-component/format.component';
import { FormatListComponent } from './format-list-component/format-list.component';
import { IconService } from './new-adapter/icon.service';
import { ProtocolListComponent } from './protocol-list-component/protocol-list.component';
import { UnitProviderService } from './schema-editor/unit-provider.service';
import { SelectStaticPropertiesComponent } from './select-static-properties-component/select-static-properties.component';
import { StaticAlternativesComponent } from './static-properties/static-alternatives/static-alternatives.component';
import { StaticAnyInput } from './static-properties/static-any-input/static-any-input.component';
import { StaticCollectionComponent } from './static-properties/static-collection/static-collection.component';
import { StaticFileInputComponent } from './static-properties/static-file-input/static-file-input.component';
import { StaticFileRestService } from './static-properties/static-file-input/static-file-rest.service';
import { StaticGroupComponent } from './static-properties/static-group/static-group.component';
import { StaticOneOfInputComponent } from './static-properties/static-one-of-input/static-one-of-input.component';
import { StaticRuntimeResolvableAnyInputComponent } from './static-properties/static-runtime-resolvable-any-input/static-runtime-resolvable-any-input.component';
import { StaticRuntimeResolvableOneOfInputComponent } from './static-properties/static-runtime-resolvable-oneof-input/static-runtime-resolvable-oneof-input.component';


import { FilterPipe } from '../connect/data-marketplace/filter.pipe';
import { PlatformServicesModule } from '../platform-services/platform.module';
import { AdapterExportDialog } from './data-marketplace/adapter-export/adapter-export-dialog.component';
import { AdapterUploadDialog } from './data-marketplace/adapter-upload/adapter-upload-dialog.component';
import { TimestampPipe } from './filter/timestamp.pipe';
import { EventPropertyListComponent } from './schema-editor/event-property-list/event-property-list.component';
import { StaticMappingNaryComponent } from './static-properties/static-mapping-nary/static-mapping-nary.component';
import { StaticMappingUnaryComponent } from './static-properties/static-mapping-unary/static-mapping-unary.component';

import { TreeModule } from 'angular-tree-component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PropertySelectorService } from '../services/property-selector.service';
import { EventPropertyRowComponent } from './schema-editor/event-property-row/event-property-row.component';
import { EventSchemaPreviewComponent } from './schema-editor/event-schema-preview/event-schema-preview.component';
import { StaticColorPickerComponent } from './static-properties/static-color-picker/static-color-picker.component';
import { AdapterDocumentationDialogComponent } from './data-marketplace/adapter-description/documentation/adapter-documentation-dialog.component';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FlexLayoutModule,
        MatGridListModule,
        CustomMaterialModule,
        DragulaModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatFormFieldModule,
        PlatformServicesModule,
        TreeModule.forRoot(),
        ColorPickerModule
    ],
    exports: [
        StaticPropertyComponent,
        SelectStaticPropertiesComponent
    ],
    declarations: [
        NewAdapterComponent,
        SelectProtocolComponent,
        FormatFormComponent,
        EventSchemaComponent,
        EventPropertyPrimitiveComponent,
        EventPropertyComponent,
        EventPropertyRowComponent,
        EventPropertyListComponent,
        StaticPropertyComponent,
        AdapterStartedDialog,
        AdapterExportDialog,
        AdapterUploadDialog,
        AdapterDocumentationDialogComponent,
        StaticNumberInputComponent,
        StaticUrlInputComponent,
        StaticTextInputComponent,
        StaticFreeInputComponent,
        StaticSecretInputComponent,
        StaticFileInputComponent,
        StaticMappingNaryComponent,
        StaticMappingUnaryComponent,
        TimestampPipe,
        StaticAnyInput,
        ProtocolComponent,
        ProtocolListComponent,
        FormatListComponent,
        FormatComponent,
        DataMarketplaceComponent,
        AdapterDescriptionComponent,
        ConnectComponent,
        SelectStaticPropertiesComponent,
        StaticOneOfInputComponent,
        StaticRuntimeResolvableAnyInputComponent,
        StaticRuntimeResolvableOneOfInputComponent,
        FileManagementComponent,
        FilterPipe,
        EventSchemaPreviewComponent,
        StaticGroupComponent,
        StaticAlternativesComponent,
        StaticCollectionComponent,
        StaticColorPickerComponent
    ],
    providers: [
        RestService,
        ConnectService,
        DataTypesService,
        TransformationRuleService,
        StaticPropertyUtilService,
        DataMarketplaceService,
        IconService,
        ShepherdService,
        UnitProviderService,
        TimestampPipe,
        FileRestService,
        StaticFileRestService,
        PropertySelectorService,
        {
            provide: '$state',
            useFactory: ($injector: any) => $injector.get('$state'),
            deps: ['$injector'],
        },
        {
            provide: '$timeout',
            useFactory: ($injector: any) => $injector.get('$timeout'),
            deps: ['$injector'],
        },
        {
            provide: 'TourProviderService',
            useFactory: ($injector: any) => $injector.get('TourProviderService'),
            deps: ['$injector'],
        },
    ],
    entryComponents: [
        ConnectComponent,
        AdapterStartedDialog,
        AdapterExportDialog,
        AdapterUploadDialog,
        AdapterDocumentationDialogComponent,
        EventPropertyComponent],
})
export class ConnectModule { }
