import { Component, Input, OnInit } from '@angular/core';
import { RadarService } from '../shared/radar.service';
import { RecordService } from '../shared/record.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Radar } from '../shared/radar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  data: any[];
  source: LocalDataSource;
  error: any;

  settings = {
    columns: {
      id: {
        title: 'Radarstationen',
        editable: true,
        addable: false,
      },


      street_name: {
        title: 'Strasse',
      },
      date: {
        title: 'Datum',
      },
      speed_limit: {
        title: 'Höchstgeschw.',
      },
      avg_speed: {
        title: 'Durchschn.geschw.',
      },
      speeding_quote: {
        title: 'Übertretungsquote',
      },
    },
  };


    constructor(
    private radarService: RadarService,
    private recordService: RecordService
  ) { }

  ngOnInit() {
    this.radarService.getRadars()
      .subscribe(
      event => {
        this.data = event;
        this.source = new LocalDataSource(this.data)
      },
      err => {
        this.error = err;
        console.log(err);
      })
  }

}
