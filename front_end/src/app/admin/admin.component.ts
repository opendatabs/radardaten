import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { RadarService } from '../shared/radar.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Radar } from '../shared/radar';
import { AddRecordsBtnComponent } from './utility/add-records-btn.component';
import { SelectCoordinatesComponent } from '../main/select-coordinates/select-coordinates.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DatepickerComponent } from './utility/datepicker.component';
import { AuthService } from '../shared/auth.service';
// import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  entryComponents: [
    AddRecordsBtnComponent,
    SelectCoordinatesComponent,
    DatepickerComponent
  ]
})
export class AdminComponent implements OnInit {

  @Output() selectClick: EventEmitter<any> = new EventEmitter();

  admin: boolean;
  data: any[];
  source: LocalDataSource;

  filterActive = false;
  error: any;


  settings = {
    columns: {
      streetName: {
        title: 'Strasse & Nr.',
        filter: false,
      },
      date: {
        title: 'Hinzugefügt am',
        filter: false,
        editable: false,
        addable: false,
        // type: 'html',
        // valuePrepareFunction: value => {
        //   return moment(value).format('L');
        // },
        // editor: {
        //   type: 'custom',
        //   component: DatepickerComponent,
        // },
      },
      speedLimit: {
        title: 'Limite (km/h)',
        filter: false,
      },
      avgDir1: {
        title: 'Ø (km/h) R1',
        filter: false,
        editable: false,
        addable: false,
      },
      avgDir2: {
        title: 'Ø (km/h) R2',
        filter: false,
        editable: false,
        addable: false,
      },
      speedingQuoteDir1: {
        title: 'Übertr.quote R1',
        filter: false,
        editable: false,
        addable: false,
      },
      speedingQuoteDir2: {
        title: 'Übertr.quote R2',
        filter: false,
        editable: false,
        addable: false,
      },
      locationButton: {
        title: 'Koordinaten',
        filter: false,
        type: 'custom',
        addable: false,
        editable: false,
        renderComponent: SelectCoordinatesComponent,
        onComponentInitFunction(instance) {
          instance.open.subscribe(row => {
            // probably no action needed
          });
        }
      },
      recordsButton: {
        title: 'Messungen',
        filter: false,
        type: 'custom',
        editable: false,
        addable: false,
        renderComponent: AddRecordsBtnComponent,
        onComponentInitFunction(instance) {
          instance.open.subscribe(row => {
            // TODO: overwrite old entries in case of duplicates
          });
        }
      },
      recordCount: {
        title: '# Messungen',
        filter: false,
        editable: false,
        addable: false,
      },
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: 'Löschen',
    },
    edit: {
      confirmSave: true,
      editButtonContent: 'Anpassen'
    },
    add: {
      confirmCreate: true,
      addButtonContent: 'Erstellen',
      createButtonContent: 'Erstellen',
      cancelButtonContent: 'Abbrechen',
    },
    cancel: {
      cancelButtonContent: 'Abbrechen',
    },
    create: {
      createButtonContent: 'Erstellen',
    },
    attr: {
      class: 'table'
    },
    actions: {
      add: true,
      edit: true,
      delete: true,
      columnTitle: 'Aktionen',
    },
  };

  constructor(
    private radarService: RadarService,
    private authService: AuthService
  ) {
    // moment.locale('de-ch');
  }

  ngOnInit() {
    this.authService.currentAdminState.subscribe(admin => this.admin = admin);
    if (!this.data) {
      this.getData();
    }
  }

  onClickDelete(event) {
    if (confirm(`
    Wollen Sie den Eintrag und alle damit verbundenen
    Messungen und Koordinaten wirklich löschen?`)) {
      if (event.data.hasOwnProperty('id')) {
        const radar: Radar = event.data;
        this.radarService.deleteRadar(radar)
          .subscribe(
            res => {
              event.confirm.resolve(event.source.data);
            },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                console.log('Client-side error occured.');
              } else {
                console.log('Server-side error occured.');
                console.log(err);
              }
            }
          );
      }
    }
  }

  onClickEdit(event) {
    event.newData.speedLimit = this.validateSpeed(event.newData.speedLimit);
    const radar: Radar = event.newData;
    this.radarService.updateRadar(radar)
      .subscribe(
        res => {
          event.confirm.resolve(event.newData);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
            console.log(err);
          }
        }
      );
  }

  onClickCreate(event) {
    event.newData.speedLimit = this.validateSpeed(event.newData.speedLimit);
    // event.newData.avgSpeed1 = Number(event.newData.avgSpeed1);
    // event.newData.speedingQuote1 = Number(event.newData.speedingQuote1);
    // console.log(this.data);
    this.radarService.addRadar(event.newData)
      .subscribe(
        res => {
          event.confirm.resolve(event.newData);
          // Necessary in case the radar gets deleted right after creation. No ID otherwise.
          this.getData();
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
            console.log(err);
          }
        }
      );
  }

  private getData(): void {
    this.radarService.getRadarWithAvgSpeedAndSpeedingQuote()
      .subscribe(
        res => {
          this.data = res;
          this.source = new LocalDataSource(this.data);
        },
        err => {
          this.error = err;
          console.log(err);
        }
      );
  }

  private validateSpeed(speed: number): number {
      // cast string to number; NaN if cast is flawed
      if (!isNaN(Number(speed)) && speed > 0 && speed < 120) {
        return Number(speed);
      }
      return 1;
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'streetName',
        search: query
      },
    ], false);
    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here

    query.length ? this.filterActive = true : this.onClearFilter();
  }

  onClearFilter(): void {
    this.source.reset();
    this.filterActive = false;
    $('#search').val('');
  }

}
