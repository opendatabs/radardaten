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

  constructor(
    private dataService: DataService,
    private cd:ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  open(radar: Radar) {
    this.dataService.getDetailData().subscribe((data:any[]) => {
      this.data = data;
      // we need this because the action is called from leaflet. and leaflet has a bug that it'doesn't trigger update circle after changes
      this.cd.detectChanges();
    });
  }
}
