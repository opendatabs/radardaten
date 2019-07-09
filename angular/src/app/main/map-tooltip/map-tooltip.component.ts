import { Component, OnInit } from '@angular/core';
import { Radar } from '../../shared/radar';
import { ColorService } from '../../shared/color.service';
declare var $: any;

@Component({
  selector: 'app-map-tooltip',
  templateUrl: './map-tooltip.component.html',
  styleUrls: ['./map-tooltip.component.css'],
})
export class MapTooltipComponent implements OnInit {

  pxLeft: number;
  pxTop: number;
  display = 'none';
  transform = '';
  content: Radar;

  TOOLTIP_PX_LEFT = 220;
  TOOLTIP_PX_TOP = -200;

  constructor(
    private colorService: ColorService,
  ) { }

  ngOnInit() {
  }

  showTooltip(pxLeft: number, pxTop: number, radar: Radar) {
    this.pxTop = Math.max(pxTop, 50);
    this.pxLeft = pxLeft + this.TOOLTIP_PX_LEFT;
    this.display = 'block';
    this.transform = $('.leaflet-map-pane').css('transform');
    this.content = radar;
  }

  hideTooltip() {
    this.display = 'none';
  }

  perc2Color(perc: number): string {
    return this.colorService.perc2color(perc);
  }



}
