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


import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Konva from 'konva';
import { Annotation } from '../../../core-model/coco/Annotation';
import { CocoFormat } from '../../../core-model/coco/Coco.format';
import { DatalakeRestService } from '../../../core-services/datalake/datalake-rest.service';
import { TsonLdSerializerService } from '../../../platform-services/tsonld-serializer.service';
import { ImageContainerComponent } from '../components/image-container/image-container.component';
import { ICoordinates } from '../model/coordinates';
import { LabelingMode } from '../model/labeling-mode';
import { BrushLabelingService } from '../services/BrushLabeling.service';
import { CocoFormatService } from '../services/CocoFormat.service';
import { LabelingModeService } from '../services/LabelingMode.service';
import { PolygonLabelingService } from '../services/PolygonLabeling.service';
import { ReactLabelingService } from '../services/ReactLabeling.service';
import {MatDialog} from '@angular/material/dialog';
import {ImageLabelingDescriptionDialogComponent} from './image-labeling-description/image-labeling-description-dialog.component'
@Component({
  selector: 'sp-image-labeling',
  templateUrl: './image-labeling.component.html',
  styleUrls: ['./image-labeling.component.css']
})
export class ImageLabelingComponent implements OnInit, AfterViewInit, OnChanges {

  // label
  public labels;
  public selectedLabel: {category, label};

  // images
  public imagesSrcs = [];
  public imagesIndex: number;
  imageDescription: String;

  public cocoFiles: CocoFormat[] = [];

  public isHoverComponent;
  public brushSize: number;

  public isDrawing: boolean = false;

  @ViewChild(ImageContainerComponent) imageView: ImageContainerComponent;

  @Input() measureName = 'image'; // TODO: Remove default value for production
  @Input() eventSchema = undefined; // TODO: event schema should be always injected by production
  imageField = undefined;
  pageIndex = undefined;
  pageSum = undefined;

  // Flags
  private setImagesIndexToFirst = false;
  private setImagesIndexToLast = false;



  constructor(private restService: DatalakeRestService, private reactLabelingService: ReactLabelingService,public dialog: MatDialog,
              private polygonLabelingService: PolygonLabelingService, private brushLabelingService: BrushLabelingService,
              private snackBar: MatSnackBar, private cocoFormatService: CocoFormatService,
              private tsonLdSerializerService: TsonLdSerializerService,
              public labelingMode: LabelingModeService) { }

  ngOnInit(): void {
    this.isHoverComponent = false;
    this.brushSize = 5;
    this.imagesIndex = 0;
    this.imageDescription = "The Description of the selected image"
    this.labels = this.restService.getLabels();

    // TODO remove for production, if default dev values are not necessary
    if (this.eventSchema === undefined) {
      this.restService.getAllInfos().map(data => {
        return this.tsonLdSerializerService.fromJsonLdContainer(data, 'sp:DataLakeMeasure');
      }).subscribe(
        res => {
          this.eventSchema = res.find(elem => elem.measureName === this.measureName).eventSchema;
          const properties = this.eventSchema.eventProperties;
          for (const prop of properties) {
            // if (prop.domainProperties.find(type => type === 'https://image.com')) {
            if (prop.domainProperty === 'https://image.com') {
              this.imageField = prop;
              break;
            }
          }
          this.loadData();
        }
      );
    }
  }
  showImageDescription(){
    const dialogRef = this.dialog.open(ImageLabelingDescriptionDialogComponent, {
      width: '70%',
      height: '500px',
      panelClass: 'custom-dialog-container',
      data : this.imageDescription
  });
  }

  ngOnChanges() {
    if (this.eventSchema !== null) {
      const properties = this.eventSchema.eventProperties;
      for (const prop of properties) {
        if (prop.domainProperty === 'https://image.com') {
          this.imageField = prop;
          break;
        }
      }
      this.pageIndex = undefined;
      this.pageSum = undefined;
      this.imagesIndex = 0;

      this.loadData();
    }
  }

  ngAfterViewInit(): void {
    this.imagesIndex = 0;
  }

  loadData() {
    if (this.pageIndex === undefined) {
      this.restService.getDataPageWithoutPage(this.measureName, 10).subscribe(
        res => this.processData(res)
      );
    } else {
      this.restService.getDataPage(this.measureName, 10, this.pageIndex).subscribe(
        res => this.processData(res)
      );
    }
  }

  processData(pageResult) {
    if (pageResult.rows === undefined) {
      this.pageIndex = pageResult.pageSum - 1;
      this.openSnackBar('No new data found');
    } else {
      pageResult.rows = pageResult.rows.reverse();
      this.pageIndex = pageResult.page;
      this.pageSum = pageResult.pageSum;

      if (this.setImagesIndexToFirst) {
        this.imagesIndex = 0;
      } else if (this.setImagesIndexToLast) {
        this.imagesIndex = pageResult.rows.length - 1;
      }
      this.setImagesIndexToLast = false;
      this.setImagesIndexToFirst = false;

      const imageIndex = pageResult.headers.findIndex(name => name === this.imageField.runtimeName);
      const tmp = [];
      this.cocoFiles = [];
      pageResult.rows.forEach(row => {
        tmp.push(this.restService.getImageUrl(row[imageIndex]));
        this.restService.getCocoFileForImage(row[imageIndex]).subscribe(
          coco => {
            if (coco === null) {
              const cocoFile = new CocoFormat();
              this.cocoFormatService.addImage(cocoFile, (row[imageIndex]));
              this.cocoFiles.push(cocoFile);
            } else {
              this.cocoFiles.push(coco as CocoFormat);
            }
          }
        );

      });
      this.imagesSrcs = tmp;
    }


  }


  /* sp-image-view handler */
  handleMouseDownLeft(layer: Konva.Layer, shift: ICoordinates, position: ICoordinates) {
    if (this.labelingEnabled()) {
      switch (this.labelingMode.getMode()) {
        case LabelingMode.ReactLabeling: this.reactLabelingService.startLabeling(position);
          break;
        case LabelingMode.PolygonLabeling: this.polygonLabelingService.startLabeling(position);
          break;
        case LabelingMode.BrushLabeling: this.brushLabelingService.startLabeling(position, this.brushSize);
      }
    }
  }

  handleMouseMove(layer: Konva.Layer, shift: ICoordinates, position: ICoordinates) {
    switch (this.labelingMode.getMode()) {
      case LabelingMode.PolygonLabeling: {
        this.polygonLabelingService.executeLabeling(position);
        this.polygonLabelingService.tempDraw(layer, shift, this.selectedLabel.label);
      }
    }
  }

  handleMouseMoveLeft(layer: Konva.Layer, shift: ICoordinates, position: ICoordinates) {
    if (this.labelingEnabled()) {
      switch (this.labelingMode.getMode()) {
        case LabelingMode.ReactLabeling: {
          this.reactLabelingService.executeLabeling(position);
          this.reactLabelingService.tempDraw(layer, shift, this.selectedLabel.label);
        }
          break;
        case  LabelingMode.BrushLabeling: {
          this.brushLabelingService.executeLabeling(position);
          this.brushLabelingService.tempDraw(layer, shift, this.selectedLabel.label);
        }
      }
   }
  }

  handleMouseUpLeft(annotationLayer: Konva.Layer, drawLayer: Konva.Layer, shift: ICoordinates, position: ICoordinates) {
    if (this.labelingEnabled()) {
      switch (this.labelingMode.getMode()) {
        case LabelingMode.ReactLabeling: {
          const result = this.reactLabelingService.endLabeling(position);
          const coco = this.cocoFiles[this.imagesIndex];
          const annotation = this.cocoFormatService.addReactAnnotationToFirstImage(coco, result[0], result[1],
            this.selectedLabel.category, this.selectedLabel.label);
          this.reactLabelingService.draw(annotationLayer, shift, annotation, this.imageView);
        }
          break;
        case LabelingMode.PolygonLabeling: {
           this.polygonLabelingService.tempDraw(drawLayer, shift, this.selectedLabel.label);
        }
          break;
        case LabelingMode.BrushLabeling: {
          const result = this.brushLabelingService.endLabeling(position);
          const coco = this.cocoFiles[this.imagesIndex];
          const annotation = this.cocoFormatService.addBrushAnnotationFirstImage(coco, result[0], result[1],
            this.selectedLabel.category, this.selectedLabel.label);
          this.brushLabelingService.draw(annotationLayer, shift, annotation, this.imageView);
        }
      }
    }
  }

  handleMouseDownRight(layer: Konva.Layer, shift: ICoordinates, position: ICoordinates) {
    this.labelingMode.toggleNoneMode();
  }


  handleImageViewDBClick(layer: Konva.Layer, shift: ICoordinates, position: ICoordinates) {
    if (this.labelingEnabled()) {
      switch (this.labelingMode.getMode()) {
        case LabelingMode.PolygonLabeling:
          const points = this.polygonLabelingService.endLabeling(position);
          const coco = this.cocoFiles[this.imagesIndex];
          const annotation = this.cocoFormatService.addPolygonAnnotationFirstImage(coco, points,
            this.selectedLabel.category, this.selectedLabel.label);
          this.polygonLabelingService.draw(layer, shift, annotation, this.imageView);
      }
    }
  }

  handleChildRedraw(layer: Konva.Layer, shift: ICoordinates) {
    const coco = this.cocoFiles[this.imagesIndex];
    if (coco  !== undefined) {
      for (const annotation of coco.annotations) {
        annotation.isHovered = false;
        annotation.isSelected = false;
        if (this.cocoFormatService.isBoxAnnonation(annotation)) {
          this.reactLabelingService.draw(layer, shift, annotation, this.imageView);
        } else if (this.cocoFormatService.isPolygonAnnonation(annotation) && !this.cocoFormatService.isBrushAnnonation(annotation)) {
          this.polygonLabelingService.draw(layer, shift, annotation, this.imageView);
        } else if (this.cocoFormatService.isBrushAnnonation(annotation)) {
          this.brushLabelingService.draw(layer, shift, annotation, this.imageView);
        }
      }
    }
  }

  handleImageViewShortCuts(key) {
    if (key === 'delete') {
      const coco = this.cocoFiles[this.imagesIndex];
      const toDelete = coco.annotations.filter(anno => anno.isSelected);
      for (const anno of toDelete) {
        this.handleDeleteAnnotation(anno);
      }
    }
  }

  handleIsDrawing(bool: boolean) {
    this.isDrawing = bool;
  }

  /* sp-image-labels handler */
  handleLabelChange(label: {category, label}) {
    this.selectedLabel = label;
  }

  /* sp-image-bar */
  handleImageIndexChange(index) {
    if (!this.isDrawing) {
      this.save();
      this.imagesIndex = index;
    }
  }
  handleImagePageUp(e) {
    if (!this.isDrawing) {
      this.save();
      this.pageIndex += 1;
      this.setImagesIndexToLast = true;
      this.loadData();
    }
  }

  handleImagePageDown(e) {
    if (!this.isDrawing) {
      this.save();
      if (this.pageIndex - 1 >= 0) {
        this.pageIndex -= 1;
        this.setImagesIndexToFirst = true;
        this.loadData();
      }
    }
  }

  /* sp-image-annotations handlers */
  handleChangeAnnotationLabel(change: [Annotation, string, string]) {
    if (!this.isDrawing) {
      const coco = this.cocoFiles[this.imagesIndex];
      const categoryId = this.cocoFormatService.getLabelId(coco, change[1], change[2]);
      change[0].category_id = categoryId;
      change[0].category_name = change[2];
      this.imageView.redrawAll();
    }
  }

  handleDeleteAnnotation(annotation) {
    if (!this.isDrawing) {
      if (annotation !== undefined) {
        const coco = this.cocoFiles[this.imagesIndex];
        this.cocoFormatService.removeAnnotation(coco, annotation.id);
        this.imageView.redrawAll();
      }
    }
  }

  /* utils */

  private labelingEnabled() {
    const coco = this.cocoFiles[this.imagesIndex];
    const annotation = coco.annotations.find(anno => anno.isHovered && anno.isSelected);
    if (annotation !== undefined) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    const coco = this.cocoFiles[this.imagesIndex];
    if (coco !== undefined) {
      const imageSrcSplitted = this.imagesSrcs[this.imagesIndex].split('/');
      const imageRoute = imageSrcSplitted[imageSrcSplitted.length - 2];
      this.restService.saveCocoFileForImage(imageRoute, JSON.stringify(coco)).subscribe(
        res =>    this.openSnackBar('Saved')
      );
    }
  }
  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  
}
