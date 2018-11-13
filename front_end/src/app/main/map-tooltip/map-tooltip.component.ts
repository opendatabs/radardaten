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

  constructor(
    private colorService: ColorService,
  ) { }

  ngOnInit() {
  }

  showTooltip(pxLeft: number, pxTop: number, radar: Radar) {
    // let tooltipWidht = $('#tooltip').width();
    this.pxTop = pxTop;
    // if (this.pxLeft <= $('#map').width() / 2)
    //   this.pxLeft = pxLeft - tooltipWidht - 10;
    // else
    this.pxLeft = pxLeft;
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
