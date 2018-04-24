import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Radar} from "../../shared/radar";
declare var $:any;

@Component({
  selector: 'app-map-tooltip',
  templateUrl: './map-tooltip.component.html',
  styleUrls: ['./map-tooltip.component.css'],
})
export class MapTooltipComponent implements OnInit {

  pxLeft: number;
  pxTop: number;
  display: string = 'none';
  transform: string = '';
  content: Radar;

  constructor() { }

  ngOnInit() {
  }

  showTooltip(pxLeft: number, pxTop: number, radar: Radar) {
    this.pxLeft = pxLeft;
    this.pxTop = pxTop;
    this.display = 'block';
    this.transform = $('.leaflet-map-pane').css('transform');
    this.content = radar;
  }

  hideTooltip() {
    this.display = 'none';
  }



}
