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
    private cd:ChangeDetectorRef
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
    // we need this because the action is called from leaflet. and leaflet has a bug that it'doesn't trigger update circle after changes
    this.cd.detectChanges();
  }
}
