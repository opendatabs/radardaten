import { Component, OnInit, ViewChild } from '@angular/core';
import { Radar } from '../../shared/radar';
import { MapDetailComponent} from '../map-detail/map-detail.component';
import { RadarService } from '../../shared/radar.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  @ViewChild(MapDetailComponent) mapDetailComponent: MapDetailComponent;

  data: Radar[];

  constructor(
    private radarService: RadarService,
) { }

  ngOnInit() {
    this.radarService.getRadarWithAvgSpeedAndSpeedingQuote()
      .subscribe(
        res => {
          this.data = res;
        },
        err => console.log(err)
      );
  }

  openDetails(radar: Radar) {
    this.mapDetailComponent.open(radar);
  }

  open() {
    this.mapDetailComponent.open(this.data[0]);
  }
}
