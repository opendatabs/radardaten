import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../shared/data-service.service";
import {Radar} from "../../shared/radar";
import {MapDetailComponent} from "../map-detail/map-detail.component";
import { RadarService } from '../../shared/radar.service';

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
    private radarService: RadarService,
) { }

  ngOnInit() {
    // this.dataService.getMapData().subscribe((data:Radar[]) => {
    this.radarService.getRadars()
      .subscribe(
        res => this.data = res,
        err => console.log(err)
      );
  }

  openDetails(radar: Radar) {
    this.hideDetail = false;
    this.mapDetailComponent.open(radar);
  }
}
