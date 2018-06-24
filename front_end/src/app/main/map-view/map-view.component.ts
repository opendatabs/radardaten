import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../shared/data-service.service";
import {Radar} from "../../shared/radar";
import {MapDetailComponent} from "../map-detail/map-detail.component";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  @ViewChild(MapDetailComponent) mapDetailComponent: MapDetailComponent;

  data: Radar[];
  hideDetail: boolean = true;

  constructor(
    private dataService: DataService,
) { }

  ngOnInit() {
    this.dataService.getMapData().subscribe((data:Radar[]) => {
      this.data = data;
    }, err => {
      console.log(err);
      alert('an error occured');
    })
  }

  openDetails(radar: Radar) {
    this.hideDetail = false;
    this.mapDetailComponent.open(radar);
  }
}
