import {
  ApplicationRef, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {divIcon, latLng, Layer, marker, tileLayer, Map, tooltip} from "leaflet";
import {MapTooltipComponent} from "../map-tooltip/map-tooltip.component";
import {Radar} from "../../shared/radar";
import {ColorService} from "../../shared/color.service";
declare var $:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(MapTooltipComponent) tooltip: MapTooltipComponent;

  @Input() data: Radar[];
  @Output() bubbleClickEvent: EventEmitter<any> = new EventEmitter();

  markers: Layer[] = [];
  map = null;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 13,
    center: latLng(47.55814, 7.58769)
  };

  constructor(
    private ref:ApplicationRef,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    let mark;
    let self = this;

    this.data.forEach((d: Radar, index: number) => {
      let color = this.colorService.perc2color2(d.speedingQuote*100);
      let i = divIcon({html: "<svg width='15' height='15' class='svg-marker'>" +
        "<circle fill='"+color+"' class='circle' id='circle"+index+"'></circle>" +
        "</svg>"});

      mark = marker([ d.lat, d.long ], {
        icon: i
      }).on('mouseover', function() {
        self.showPopup(this, self, d)
      }).on('mouseout', function () {
          self.hidePopup()
        }).on('click', function () {
          $('#map').find('.active').removeClass('active');
          $("#circle"+index).addClass('active');
          self.openDetails(d);
        });
      this.markers.push(mark);
    })
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.setMaxBounds(this.map.getBounds());
    this.map.setMinZoom(13);
  }

  showPopup(lefletElement: any, self: MapComponent, radar: Radar): void {
    // because there is a bug in leaflet callbacks, we have to implement change detection by ourselves
    this.tooltip.showTooltip(
      this.map.latLngToLayerPoint(lefletElement._latlng).x,
      this.map.latLngToLayerPoint(lefletElement._latlng).y,
      radar
    );
    self.ref.tick();
  }

  hidePopup() {
    this.tooltip.hideTooltip();
    this.ref.tick();
  }

  openDetails(radar: Radar) {
    this.bubbleClickEvent.emit(radar);
  }

}
