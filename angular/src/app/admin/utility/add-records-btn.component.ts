import {Component, Input, Output, EventEmitter, OnInit, OnDestroy, ApplicationRef, ElementRef} from '@angular/core';
import { ViewCell} from 'ng2-smart-table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RadarService } from '../../shared/radar.service';
import * as $ from 'jquery';
import { SailsClientService } from '../../shared/sails-client.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-add-records-btn',
  template: `
    <ng-template #content let-c="close" let-d="dismiss">
      <div class="modal-header">
        <h4 class="modal-title">Messungen für {{rowData.streetName}} hochladen</h4>
        <button type="button" class="close" aria-label="Close" (click)="closeModal()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-8">
            <div class="custom-file">
              <input type="file"
                     class="custom-file-input"
                     id="customFile"
                     (change)="fileChanged($event);changePathValue($event)">
              <label class="custom-file-label"
                     for="customFile" id="uploadLabel">
                .txt-Datei wählen
              </label>
            </div>
          </div>
          <button type="button"
                  *ngIf="file && validFiletype"
                  class="btn btn-outline-primary"
                  [class.disabled]="isClicked"
                  (click)="uploadDocument();isClicked=true">
            Hochladen
          </button>
        </div>
        <div *ngIf="(file && !validFiletype) || error" class="alert alert-danger mt-2" role="alert">
          Fehler: {{ error }}
        </div>
        <div class="container h-100 my-2" *ngIf="!success && loading">
          <div class="row h-100 justify-content-center align-items-center">
            <fa class="alingn" name="refresh" size="4x" animation="spin"></fa>
          </div>
          <div class="row h-100 justify-content-center align-items-center">
            <p class="mt-3">Anzahl Messungen: <strong>{{ foundMatches }}</strong> | Gespeichert: <strong>{{ progress }}
              %</strong>
            <p>
          </div>
        </div>
        <div *ngIf="!success && fileSize > 300000" class="alert alert-warning mt-2" role="alert">
          <b>Warnung</b> Sie laden mehr als 300KB an Daten hoch. Das Parsen der Daten kann mehrere Minuten in Anspuch
          nehmen.
        </div>
        <p *ngIf="aggregatedRecords">
          {{ aggregatedRecords }} Messungen aggregiert.
        </p>
        <div *ngIf="success" class="alert alert-success mt-2" role="alert">
          {{ foundMatches }} Messungen erfolgreich hochgeladen
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-dark" (click)="closeModal()">Close</button>
      </div>
    </ng-template>
    <button (click)="onOpen(content)" class="btn btn-outline-primary py-0">Hochladen</button>
  `,
  styles: []
})
export class AddRecordsBtnComponent implements ViewCell, OnInit, OnDestroy {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  file: any;
  fileSize: 0;
  validFiletype = false;
  loading = false;
  success = false;
  progress = 0;
  creationCounter: number;
  // recordsCreated = 0;
  foundMatches = 0;
  error: any;
  closeResult: string;
  isClicked = false;
  public users$: Observable<any>;
  sub: any;
  aggregatedRecords: number;
  counter = 0;
  modalReference: any;

  constructor(
    private modalService: NgbModal,
    private radarService: RadarService,
    private sailsClientService: SailsClientService,
    private ref: ElementRef
  ) {
  }

  ngOnInit() {
    this.sub = this.sailsClientService.on('newRecords').subscribe(
      (data: any) => {
          this.progress = Math.round(data.progress * 100);
          // OK if more than 98% done
          if (this.progress >= 98 || this.foundMatches < 50) {
            this.loading = false;
            this.success = true;
          }
          this.counter++;
      }
    );
    this.sailsClientService.on('recordsAggregated').subscribe((data:any) => {
      setTimeout(() => {
        this.aggregatedRecords = data.recordsCreated;
      }, 0);
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onOpen(content) {
    this.success = false;
    this.loading = false;
    this.error = null;
    this.aggregatedRecords = null;
    this.modalReference = this.modalService.open(content, { windowClass: 'big-modal', backdrop: 'static', keyboard: false });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else {
      return  `with: ${reason}`;
    }
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    this.error = null;
    this.success = false;
    this.fileSize = this.file.size;
    if (this.file.type === 'text/plain') {
      this.validFiletype = true;
    } else {
      this.error = 'Kein zulässiger Dateitype ausgewählt. Bitte laden Sie eine .txt Datei hoch.';
    }
  }

  uploadDocument(file) {
    const fileReader = new FileReader();
    fileReader.onload = e => {
      this.loading = true;
      this.creationCounter = 0;
      this.error = null;
      // replace api/ in url. sockets requests should be redirected to sockets.io api, not to custom api/ route.
      this.sailsClientService.post( environment.socketApi + 'record/batchCreate', {
        id: this.rowData.id, text: fileReader.result.toString()
      })
        .subscribe(
          res => {
            this.foundMatches = res.foundMatches;
            // console.log('Should be: ' + this.rowData.Recordcount);
          },
          err => {
            this.loading = false;
            if (err.data && err.data.error.indexOf('E_VALIDATION') > 0)
              this.error = 'Diese Daten wurden bereits hochgeladen';
            else {
              this.error = JSON.stringify(err)
            }
            console.log(err);
          });
    };
    fileReader.readAsText(this.file);
    this.file = null; // discard file after upload
  }

  changePathValue(event: any): void {
    const fileName = event.target.files[0].name;
    $('#uploadLabel').html(fileName);
  }

  closeModal() {
    this.close.emit();
    this.modalReference.close()
  }
}
