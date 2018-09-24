import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell, DefaultEditor } from 'ng2-smart-table';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  template: `    
    <input type="date" [ngModel]="setDate" (change)="onChange($event)">
    <!--<input type="date" (ngModelChange)="dt = $event" (change)="onChange($event)">-->
  `,
  styles: []
})
export class DatepickerComponent extends DefaultEditor{

  @Output() open: EventEmitter<any> = new EventEmitter();

  setDate: any;

  constructor() {
    super();
    moment.locale('de-ch');
  }

  ngOnInit() {
    this.setDate = this.cell.getValue();
    // If no date is entered
    if (this.cell.getValue().length)
      this.cell.newValue = moment().toDate();
  }

  onChange(event: any) {
    this.cell.newValue = event.target.value;
    // TODO: store previous date value when edit is open


  }

}
