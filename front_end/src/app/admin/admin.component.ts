import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { RadarService } from '../shared/radar.service';
import { RecordService } from '../shared/record.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Radar } from '../shared/radar';
import { AddRecordsBtnComponent } from './utility/add-records-btn.component';
import { SelectCoordinatesComponent } from '../main/select-coordinates/select-coordinates.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  entryComponents: [
    AddRecordsBtnComponent,
    SelectCoordinatesComponent ]
})
export class AdminComponent implements OnInit {

  data: any[];



  source: LocalDataSource;
  error: any;

  @Output() selectClick: EventEmitter<any> = new EventEmitter();

  settings = {
    columns: {
      streetName: {
        title: 'Strasse & Nr.',
      },
      speedLimit: {
        title: 'Höchstgeschw.',
      },
      avgSpeed: {
        title: 'Durchschn.geschw.',
        editable: false,
      },
      speedingQuote: {
        title: 'Übertretungsquote',
        editable: false,
      },
      locationButton: {
        title: 'Koordinaten',
        type: 'custom',
        addable: false,
        editable: false,
        renderComponent: SelectCoordinatesComponent,
        onComponentInitFunction(instance) {
          instance.open.subscribe(row => {
            // probably no action needed
            // console.log(row)

          });
        }
      },
      recordsButton: {
        title: 'Messungen',
        type: 'custom',
        editable: false,
        addable: false,
        renderComponent: AddRecordsBtnComponent,
        onComponentInitFunction(instance) {
          instance.open.subscribe(row => {
            //
            alert('File upload')
            //TODO overwrite old entries in case of duplicates
          });
        }
      },

    },
    delete: {
      confirmDelete: true,
      // deleteButtonContent: '<div class="waves-effect waves-light btn red">Delete</div>'
    },
    edit: {
      confirmSave: true,
    },
    add: {
      confirmCreate: true,
    },
    attr: {
      class: 'table'
    },
    actions: {
      add: true,
      edit: true,
      delete: true
    },
  };


    constructor(
    private radarService: RadarService,
    private recordService: RecordService
  ) { }

  ngOnInit() {
    if (!this.data) {
      this.radarService.getRadars()
        .subscribe(
          event => {
            this.data = event;
            this.source = new LocalDataSource(this.data);
            console.log(this.data);
          },
          err => {
            this.error = err;
            console.log(err);
          })
    }
  }


  onClickDelete(event){
      //TODO Alert to confirm delte
    const radar: Radar = event.data;
    this.radarService.deleteRadar(radar)
      .subscribe(
        res => {
          event.confirm.resolve(event.source.data);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
            console.log(err)
          }
        });
  }

  onClickEdit(event) {
    // cast string to number; NaN if cast is flawed
    event.newData.speedLimit = Number(event.newData.speedLimit);
    const radar: Radar = event.newData;
    this.radarService.updateRadar(radar)
      .subscribe(
        res => {
          event.confirm.resolve(event.newData);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
            console.log(err);
          }
        });
  }

  onClickCreate(event){
      console.log(event)
    event.newData.speedLimit = Number(event.newData.speedLimit);
    event.newData.avgSpeed = Number(event.newData.avgSpeed);
    event.newData.speedingQuote = Number(event.newData.speedingQuote);
    this.radarService.addRadar(event.newData)
      .subscribe(
        res => {
          event.confirm.resolve(event.newData);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
            console.log(err)
          }
        });
  }

}
