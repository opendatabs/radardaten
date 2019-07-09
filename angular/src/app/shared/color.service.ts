import { Injectable } from '@angular/core';
import { D3, D3Service } from 'd3-ng2-service';

@Injectable()
export class ColorService {
  private d3: D3;
  private colorScale;

  constructor(
    d3Service: D3Service,
  ) {
    this.d3 = d3Service.getD3();
  }

  // Calculate the color of circles and arrows on the map
  perc2color(perc: number) {
    this.colorScale = this.d3.scaleLinear<string, number>()
      .domain([0, 11, 25, 100]) // Different colors for 0-10%, 11-25% and 26% up
      .range(['#ffff00', '#ffa500', '#d73027', '#a63027'])
      .interpolate(this.d3.interpolateHcl);
    return this.colorScale(perc);
  }

  perc2color2(avgSpeed: number, limit: number) {
    const perc = (avgSpeed / limit) - 1;
    this.colorScale = this.d3.scaleLinear<string, number>()
      .domain([0, 0.2, 1])
      .range(['#d73027', '#fee08b', '#1a9850'])
      .interpolate(this.d3.interpolateHcl);
    return this.colorScale(perc);
  }

  numberToColor(count: number, countMax: number): string {
    const colorScale = this.d3.scaleLinear<string, number>()
      .domain([0, countMax])
      .range(['#fcfcff', '#000000'])
      .interpolate(this.d3.interpolateHcl);
    return colorScale(count);
  }

  numberToOpacity(count: number, countMax: number): number {
    const colorScale = this.d3.scaleLinear<number, number>()
      .domain([0, countMax])
      .range([0, 1]);
    return colorScale(count);
  }
}
