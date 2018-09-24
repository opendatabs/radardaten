import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell} from 'ng2-smart-table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecordService } from '../../shared/record.service';
import { RadarService } from '../../shared/radar.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-records-btn',
  template: `
    <ng-template #content let-c="close" let-d="dismiss">
      <div class="modal-header">
        <h4 class="modal-title">Messungen für {{rowData.streetName}} hochladen</h4>
        <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
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
        </div>
        <div *ngIf="fileSize > 500000" class="alert alert-warning mt-2" role="alert">
          <b>Warnung</b> Sie laden mehr als 500KB an Daten hoch. Das Parsen der Daten kann mehrere Minuten in Anspuch
          nehmen.
        </div>
        <div *ngIf="success" class="alert alert-success mt-2" role="alert">
          <b>{{ recordsCreated }}</b> von {{ foundMatches }} Messungen erfolgreich hochgeladen
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-dark" (click)="c('Close click')">Close</button>
      </div>
    </ng-template>
    <button (click)="onOpen(content)" class="btn btn-outline-primary py-0">Hochladen</button>
  `,
  styles: []
})
export class AddRecordsBtnComponent implements ViewCell {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() open: EventEmitter<any> = new EventEmitter();

  file: any;
  fileSize: 0;
  validFiletype = false;
  loading = false;
  success = false;
  recordsCreated = 0;
  foundMatches = 0;
  error: any;
  closeResult: string;
  isClicked = false;

  constructor(
    private modalService: NgbModal,
    private recordService: RecordService,
    private radarService: RadarService,
  ) {
  }

  onOpen(content) {
    this.success = false;
    this.loading = false;
    this.error = null;
    this.modalService.open(content, { windowClass: 'big-modal' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
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
      this.error = null;
      debugger;
      this.recordService.addRecords({ id: this.rowData.id, text: fileReader.result.toString() })
        .subscribe(
          res => {
            this.loading = false;
            this.success = true;
            this.foundMatches = res.foundMatches;
            this.recordsCreated = res.recordsCreated;
            console.log(res);
            console.log(res.created)
          },
          err => {
            this.loading = false;
            this.error = err.message;
            console.log(err)
          })
    };
    fileReader.readAsText(this.file);
  }

  changePathValue(event: any): void {
    const fileName = event.target.files[0].name;
    $('#uploadLabel').html(fileName);
  }

  updateRecordCount(): void {
    this.radarService.updateRecordCount(this.rowData).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }
}
