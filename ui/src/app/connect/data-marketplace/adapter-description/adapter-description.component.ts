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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectService } from '../../connect.service';
import { AdapterDescription } from '../../model/connect/AdapterDescription';
import { AdapterExportDialog } from '../adapter-export/adapter-export-dialog.component';
import { DataMarketplaceService } from '../data-marketplace.service';
import { AdapterDocumentationDialogComponent } from './documentation/adapter-documentation-dialog.component';

@Component({
  selector: 'sp-adapter-description',
  templateUrl: './adapter-description.component.html',
  styleUrls: ['./adapter-description.component.css'],
})
export class AdapterDescriptionComponent implements OnInit {

  @Input()
  adapter: AdapterDescription;

  @Output()
  updateAdapterEmitter: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  createTemplateEmitter: EventEmitter<AdapterDescription> = new EventEmitter<AdapterDescription>();

  adapterToDelete: string;
  deleting = false;
  className = '';
  isDataSetDescription = false;
  isDataStreamDescription = false;
  isRunningAdapter = false;
  adapterLabel: string;

  constructor(private connectService: ConnectService, private dataMarketplaceService: DataMarketplaceService, public dialog: MatDialog) {}

  ngOnInit() {
      this.isDataSetDescription = this.connectService.isDataSetDescription(this.adapter);
      this.isDataStreamDescription = this.connectService.isDataStreamDescription(this.adapter);
      this.isRunningAdapter = (this.adapter.couchDbId !== undefined && !this.adapter.isTemplate);
      this.adapterLabel = this.adapter.label.split(' ').join('_');
      this.className = this.getClassName();
  }

  isGenericDescription(): boolean {
    return this.connectService.isGenericDescription(this.adapter);
  }

  isSpecificDescription(): boolean {
    return this.connectService.isSpecificDescription(this.adapter);
  }
  // showAdapterDescription(adapter){
  //   const dialogRef = this.dialog.open(AdapterDescriptionDialogComponent, {
  //     width: '70%',
  //     height: '500px',
  //     panelClass: 'custom-dialog-container',
  //     data : adapter
  // });
  // }

  deleteAdapter(adapter: AdapterDescription): void {
  this.deleting = true;
      this.adapterToDelete = adapter.couchDbId;
      this.dataMarketplaceService.deleteAdapter(adapter).subscribe(res => {
          this.adapterToDelete = undefined;
          this.updateAdapterEmitter.emit();
          this.deleting = false;
      });
  }

  shareAdapterTemplate(adapter: AdapterDescription): void {

        const dialogRef = this.dialog.open(AdapterExportDialog, {
            width: '70%',
            data: { adapter
            },
            panelClass: 'sp-no-padding-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {

        });
  }

  openAdapterDocumentation(adapter: AdapterDescription): void {

    const dialogRef = this.dialog.open(AdapterDocumentationDialogComponent, {
      width: '70%',
      data: { adapter
      },
      panelClass: 'sp-no-padding-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  deleteAdapterTemplate(adapter: AdapterDescription): void {
      this.adapterToDelete = adapter.couchDbId;
      this.dataMarketplaceService.deleteAdapterTemplate(adapter).subscribe(res => {
          this.adapterToDelete = undefined;
          this.updateAdapterEmitter.emit();
          this.deleting = false;
      });
  }

  createTemplate(adapter: AdapterDescription): void {
      this.createTemplateEmitter.emit(adapter);
  }

  getClassName() {
    let className = this.isRunningAdapter ? 'adapter-box' : 'adapter-description-box';

    if (this.isDataSetDescription) {
      className += ' adapter-box-set';
    } else {
      className += ' adapter-box-stream';
    }

    return className;
  }

  deleteInProgress(adapterCouchDbId) {
    return this.deleting && (adapterCouchDbId === this.adapterToDelete);
  }

  getIconUrl() {
    // TODO Use "this.adapter.includesAssets" if boolean demoralizing is working
    if (this.adapter.includedAssets.length > 0) {
      return this.dataMarketplaceService.getAssetUrl(this.adapter.appId) + '/icon';
    } else {
      return 'assets/img/connect/' + this.adapter.iconUrl;
    }
  }
}

