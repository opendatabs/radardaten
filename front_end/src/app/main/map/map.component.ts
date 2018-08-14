import {
  ApplicationRef, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output,
  ViewChild
} from '@angular/core';
import {divIcon, latLng, Layer, marker, tileLayer, Map, tooltip} from "leaflet";
import {MapTooltipComponent} from "../map-tooltip/map-tooltip.component";
import {Radar} from "../../shared/radar";
import {ColorService} from "../../shared/color.service";

declare var $: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(MapTooltipComponent) tooltip: MapTooltipComponent;

  @Input() data: Radar[];
  @Output() bubbleClickEvent: EventEmitter<any> = new EventEmitter();

  circleMarkers: Layer[] = [];
  arrowMarkers: Layer[] = [];
  layers: Layer[];
  map = null;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '...'}),
    ],
    zoom: 13,
    center: latLng(47.55814, 7.58769)
  };

  constructor(private ref: ApplicationRef,
              private colorService: ColorService,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.createCircleMarkers();
    this.createArrowMarkers();
    this.layers = this.circleMarkers;
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.setMaxBounds(
      {
        _southWest: {lat: 47.370186632026545, lng: 6.575416289269925},
        _northEast: {lat: 47.740904422894914, lng: 8.601020537316801}
      }
    );
    this.map.setMinZoom(10);
    const self = this;
    this.map.on('zoomend', this.onZoom.bind(this, self))
  }

  onZoom(self) {
    if (self.map._zoom >= 15) {
      self.layers = self.arrowMarkers;
    } else {
      self.layers = self.circleMarkers;
    }
    self.ref.tick();
  }

  createCircleMarkers() {
    let mark;
    let self = this;
    this.data.forEach((d: Radar, index: number) => {
      let maxSpeed = Math.max(d.speedingQuoteDir1, d.speedingQuoteDir2);
      let color = this.colorService.perc2color(maxSpeed * 100);
      let i = divIcon({
        html: "<svg width='12' height='12' class='svg-marker'>" +
        "<circle cx='7' cy='7' fill='" + color + "' class='circle' r='7' id='circle" + index + "'></circle>" +
        "</svg>"
      });

      mark = marker([d.lat, d.long], {
        icon: i
      }).on('mouseover', function () {
        self.showPopup(this, self, d)
      }).on('mouseout', function () {
        self.hidePopup()
      }).on('click', function () {
        $('#map').find('.active').removeClass('active');
        $("#circle" + index).addClass('active');
        self.zone.run(() => {
          self.openDetails(d);
        });
      });
      this.circleMarkers.push(mark);
    })
  }

  createArrowMarkers() {
    let mark;
    let self = this;
    this.data.forEach((d: Radar, index: number) => {
      let directionDegrees = this.calculateDirectionDegrees(d);
      // todo: replace by speeding quote and for two directions
      let color1 = this.colorService.perc2color(d.speedingQuoteDir1 * 100);
      let color2 = this.colorService.perc2color(d.speedingQuoteDir2 * 100);
      // create a random ID for marker to ensure unique ids.
      let randomId = Math.floor(Math.random() * Math.floor(100000));
      let i = divIcon({
        html: `
        <svg width="34px" height="36px" class="arrowSvg">
        <defs>
          <marker id="arrow1_${randomId}" markerWidth="10" markerHeight="10" refX="0" refY="1.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,3 L3,1.5 z" fill="${color1}" /> 
          </marker>
          <marker id="arrow2_${randomId}" markerWidth="10" markerHeight="10" refX="0" refY="1.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,3 L3,1.5 z" fill="${color2}" />
          </marker>
          <marker id="arrow_black_${randomId}" markerWidth="10" markerHeight="10" refX="0.2" refY="1.25" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,2.5 L2.5,1.25 z" fill="black" />
          </marker>
        </defs>
        <g transform="rotate(${directionDegrees},17,18)">
        <line x1="3" y1="10" x2="19" y2="10" stroke="black" stroke-width="6" marker-end="url(#arrow_black_${randomId})" />
        <line x1="4" y1="10" x2="19" y2="10" stroke="${color1}" stroke-width="4" marker-end="url(#arrow1_${randomId})" />
        <line x1="31" y1="25" x2="15" y2="25" stroke="black" stroke-width="6" marker-end="url(#arrow_black_${randomId})" />
        <line x1="30" y1="25" x2="15" y2="25" stroke="${color2}" stroke-width="4" marker-end="url(#arrow2_${randomId})" />
        </g>
      
      </svg>
      `
      });

      mark = marker([d.lat, d.long], {
        icon: i
      }).on('mouseover', function () {
        self.showPopup(this, self, d)
      }).on('mouseout', function () {
        self.hidePopup()
      }).on('click', function () {
        $('#map').find('.active').removeClass('active');
        $("#circle" + index).addClass('active');
        self.showPopup(this, self, d)
        self.openDetails(d);
      });
      this.arrowMarkers.push(mark);
    })
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
    const self = this;
    self.bubbleClickEvent.emit(radar);
  }

  angleFromCoordinate(lat1: number, lng1: number, lat2: number, lng2: number) {
    let dLon = (lng2 - lng1);
    let y = Math.sin(dLon) * Math.cos(lat2);
    let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let rad = Math.atan2(y, x);
    let brng = rad * 180 / Math.PI;
    return 360 - ((brng + 360) % 360) + 90;
  }

  private calculateDirectionDegrees(d: Radar) {
    return this.angleFromCoordinate(d.directionOneLat, d.directionOneLong, d.directionTwoLat, d.directionTwoLong)
  }
}
