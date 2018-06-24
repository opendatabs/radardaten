import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell} from 'ng2-smart-table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { D3Service, D3 } from 'd3-ng2-service';

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
            <label id="lbl">File </label>
            <input #fileInput type='file'/>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-dark" (click)="c('Close click')">Close</button>
      </div>
    </ng-template>
    <button (click)="onOpen(content)" class="btn btn-primary">Hochladen</button>
  `,
  styles: []
})
export class AddRecordsBtnComponent implements OnInit, ViewCell {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() open: EventEmitter<any> = new EventEmitter();

  closeResult: string;

  // private d3: D3;
  json: any; //TODO extract weekday
  data= `
km/h  date  time  direction m
007 13:40:12  20.02.15  1 3.5
006	13:40:13	20.02.15	1	3.6
008	13:40:14	20.02.15	1	3.6
013	13:40:43	20.02.15	1	4.5
009	13:41:02	20.02.15	1	2.8
016	13:43:15	20.02.15	1	3.7
014	13:43:19	20.02.15	1	4.6
016	13:44:03	20.02.15	1	3.7
018	13:45:48	20.02.15	1	3.8
016	13:46:44	20.02.15	1	4.8
012	13:47:30	20.02.15	1	4.2
005	13:48:16	20.02.15	1	3.8
007	13:48:18	20.02.15	1	3.9
014	13:49:10	20.02.15	1	3.9
  `;

  constructor(
    private modalService: NgbModal,
    // d3Service: D3Service
  ) {
    // this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    // this.json = d3.tsvParse(this.data);
  }
  onClick() {
    this.open.emit(this.rowData); // Necessary?
    //TODO add upload / parse. Take Radar from rowData
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


}
