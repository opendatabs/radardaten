import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
  hideDetail: boolean = true;

  constructor(
    private dataService: DataService,
    private radarService: RadarService,
    private calculatorService: CalculatorService
) { }

  ngOnInit() {
    // this.dataService.getMapData().subscribe((data:Radar[]) => {
    this.radarService.getRadars()
      .subscribe(
        res => {
          this.data = res;
          this.data.forEach(d => {
            d.directionOneMeanKmh = this.calculatorService.calculateAvgSpeed(d.records, 1);
            d.directionTwoMeanKmh = this.calculatorService.calculateAvgSpeed(d.records, 2);
          });
          console.log(this.data)
        },
        err => console.log(err)
      );
  }

  openDetails(radar: Radar) {
    this.hideDetail = false;
    this.mapDetailComponent.open(radar);
  }
}
