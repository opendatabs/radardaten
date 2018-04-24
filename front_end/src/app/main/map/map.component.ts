import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {divIcon, latLng, Layer, marker, tileLayer, Map, tooltip} from "leaflet";
import {MapTooltipComponent} from "../map-tooltip/map-tooltip.component";
import {Radar} from "../../shared/radar";
import {ColorService} from "../../shared/color.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(MapTooltipComponent) tooltip: MapTooltipComponent;

  @Input() data: Radar[];

  markers: Layer[] = [];
  map = null;
  left1: number;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 13,
    center: latLng(47.55814, 7.58769)
  };

  constructor(
    private cd:ChangeDetectorRef,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    let mark;
    let self = this;

    this.data.forEach((d: Radar) => {
      let color = this.colorService.perc2color(d.speeding_quote*100);
      let i = divIcon({html: "<svg width='15' height='15' class='svg-marker'>" +
        "<circle fill='"+color+"' class='circle'></circle>" +
        "</svg>"});

      mark = marker([ d.lat, d.long ], {
        icon: i
      }).on('mouseover', function() {
        self.showPopup(this, self, d)
      }).on('mouseout', function () {
          self.hidePopup()
        });
      this.markers.push(mark);
    })
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  showPopup(lefletElement: any, self: MapComponent, radar: Radar): void {
    // because there is a bug in leaflet callbacks, we have to implement change detection by ourselves
    this.tooltip.showTooltip(
      this.map.latLngToLayerPoint(lefletElement._latlng).x,
      this.map.latLngToLayerPoint(lefletElement._latlng).y,
      radar
    );
    self.cd.detectChanges();
  }

  hidePopup() {
    this.tooltip.hideTooltip();
    this.cd.detectChanges();
  }

}
