import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell} from 'ng2-smart-table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecordService } from '../../shared/record.service';
import { HttpErrorResponse } from '@angular/common/http';

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
              <label id="lbl">Messungen auswählen </label>
            <!--TODO Check filetype-->
              <input type='file' (change)="fileChanged($event)">
          </div>
          <button type="button" class="btn btn-outline-primary"
                  [class.disabled]="isClicked"
                  (click)="uploadDocument();isClicked=true">
            Hochladen</button>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-dark" (click)="c('Close click')">Close</button>
      </div>
    </ng-template>
    <button (click)="onOpen(content)" class="btn btn-outline-primary">Hochladen</button>
  `,
  styles: []
})
export class AddRecordsBtnComponent implements OnInit, ViewCell {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() open: EventEmitter<any> = new EventEmitter();

  file:any;
  fileChanged(e) {
    this.file = e.target.files[0];
  }

  closeResult: string;

  txt: any;
  // lines: Array<Record> = []; //TODO: Generic type 'Record' requires 2 type argument(s)??
  lines: Array<any> = [];
  isClicked: boolean = false;

  constructor(
    private modalService: NgbModal,
    private recordService: RecordService
  ) {
  }

  ngOnInit() { }

  onClick() {
    this.open.emit(this.rowData);
  }
  onOpen(content) {
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
  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = e => {
      this.txt = fileReader.result.toString();
      debugger;
      this.parseText(this.txt);
      debugger;
      this.recordService.addRecords(this.lines)
          .subscribe(
            res => {
              console.log('congratulations');
            },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                console.log("Client-side error occured.");
              } else {
                console.log("Server-side error occured.");
                console.log(err)
              }
            }
          );
    };
    fileReader.readAsText(this.file);
  }
  private parseText(input :string): void {
    const regex = /[0-2]\d\d\s[0-2]\d:[0-6]\d:[0-6]\d\s\d\d\.[01]\d\.[0-3]\d\s[01]\s[\d*]\.\d$/gm;
    let match;
    do {
      match = regex.exec(input);
      if (match) {
        if (match.length) {
          this.lines.push(this.recordService.parseRecord(match[0], this.rowData.id));
        }
      }
    } while (match);
  }


}
