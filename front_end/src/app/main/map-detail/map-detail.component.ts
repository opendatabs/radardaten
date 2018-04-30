import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Radar} from "../../shared/radar";
import {DataService} from "../../shared/data-service.service";

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css']
})
export class MapDetailComponent implements OnInit {

  data: any[];
  measurements: string[] = [
    "2018-04-30",
    "2018-05-01",
    "2018-05-02",
  ];
  selectedMeasurement: string;
  radar: Radar;

  constructor(
    private dataService: DataService,
    private cd:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.selectedMeasurement = this.measurements[0];
  }

  open(radar: Radar) {
    this.dataService.getDetailData().subscribe((data:any[]) => {
      this.data = data;
      this.radar = radar;
      // we need this because the action is called from leaflet. and leaflet has a bug that it'doesn't trigger update circle after changes
      this.cd.detectChanges();
      document.getElementById('map-detail').scrollIntoView();
    });
  }

  selectMesaurement(measurement: string) {
    this.selectedMeasurement = measurement;
    this.dataService.getDetailData().subscribe((data: any[]) => {
      this.data = data;
    })
  }
}
