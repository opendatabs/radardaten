import {ApplicationRef, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../shared/data-service.service";
import {Radar} from "../../shared/radar";
import {Record} from "../../shared/record";
import {MapDetailComponent} from "../map-detail/map-detail.component";
import { RadarService } from '../../shared/radar.service';
import {CalculatorService} from "../../shared/calculator.service";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  @ViewChild(MapDetailComponent) mapDetailComponent: MapDetailComponent;

  data: Radar[];

  constructor(
    private dataService: DataService,
    private radarService: RadarService,
    private ref: ApplicationRef
) { }

  ngOnInit() {
    // this.dataService.getMapData().subscribe((data:Radar[]) => {
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
