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
import {
  AdapterDescriptionUnion,
  EventRateTransformationRuleDescription, GenericAdapterSetDescription,
  RemoveDuplicatesTransformationRuleDescription, SpecificAdapterSetDescription
} from '../../../core-model/gen/streampipes-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AdapterStartedDialog } from '../../dialog/adapter-started/adapter-started-dialog.component';
import { PanelType } from '../../../core-ui/dialog/base-dialog/base-dialog.model';
import { ShepherdService } from '../../../services/tour/shepherd.service';
import { DialogService } from '../../../core-ui/dialog/base-dialog/base-dialog.service';

@Component({
  selector: 'sp-start-adapter-configuration',
  templateUrl: './start-adapter-configuration.component.html',
  styleUrls: ['./start-adapter-configuration.component.scss']
})
export class StartAdapterConfigurationComponent implements OnInit {

  /**
   * Adapter description the selected format is added to
   */
  @Input() adapterDescription: AdapterDescriptionUnion;

  /**
   * Cancels the adapter configuration process
   */
  @Output() removeSelectionEmitter: EventEmitter<boolean> = new EventEmitter();

  /**
   * Is called when the adapter was created
   */
  @Output() adapterStartedEmitter: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Go to next configuration step when this is complete
   */
  @Output() goBackEmitter: EventEmitter<MatStepper> = new EventEmitter();

  @Output() updateAdapterEmitter: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The form group to validate the configuration for the format
   */
  startAdapterForm: FormGroup;

  startAdapterSettingsFormValid = false;

  saveInDataLake = false;
  dataLakeTimestampField: string;

  isSetAdapter = false;

  private duplicateRule: RemoveDuplicatesTransformationRuleDescription;
  private eventRateReductionRule: EventRateTransformationRuleDescription;


  constructor(
    private dialogService: DialogService,
    private shepherdService: ShepherdService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // initialize form for validation
    this.startAdapterForm = this._formBuilder.group({});
    this.startAdapterForm.statusChanges.subscribe((status) => {
      this.startAdapterSettingsFormValid = this.startAdapterForm.valid;
    });

    if (this.adapterDescription instanceof GenericAdapterSetDescription ||
                                              this.adapterDescription instanceof SpecificAdapterSetDescription) {
      this.isSetAdapter = true;
    }

  }

  setDuplicateRule(rule) {
    this.duplicateRule = rule;
  }

  setEventRateReductionRule(rule) {
    this.eventRateReductionRule = rule;
  }

  public saveTemplate() {
    this.triggerDialog(true);
  }

  public startAdapter() {
    this.triggerDialog(false);
  }

  private triggerDialog(storeAsTemplate: boolean) {
    if (this.duplicateRule) {
      this.adapterDescription.rules.push(this.duplicateRule);
    }

    if (this.eventRateReductionRule) {
      this.adapterDescription.rules.push(this.eventRateReductionRule);
    }

    const dialogRef = this.dialogService.open(AdapterStartedDialog, {
      panelType: PanelType.STANDARD_PANEL,
      title: 'Adapter generation',
      width: '70vw',
      data: {
        'adapter': this.adapterDescription,
        'storeAsTemplate': storeAsTemplate,
        'saveInDataLake': this.saveInDataLake,
        'dataLakeTimestampField': this.dataLakeTimestampField
      }
    });

    this.shepherdService.trigger('button-startAdapter');

    dialogRef.afterClosed().subscribe(result => {
      this.adapterStartedEmitter.emit();
    });
  }

  /**
   * Cancel the adapter configuration process
   */
  public removeSelection() {
    this.removeSelectionEmitter.emit();
  }

  /**
   * Go one step back in the adapter configuration process
   */
  public goBack() {
    this.goBackEmitter.emit();
  }
}
