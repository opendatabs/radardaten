import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../shared/data-service.service";
import {Radar} from "../../shared/radar";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  data: Radar[];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getMapData().subscribe((data:Radar[]) => {
      this.data = data;
    }, err => {
      console.log(err);
      alert('an error occured');
    })
  }

}
