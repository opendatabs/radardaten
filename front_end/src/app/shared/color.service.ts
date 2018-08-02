import { Injectable } from '@angular/core';
import {D3, D3Service} from "d3-ng2-service";

@Injectable()
export class ColorService {
  private d3: D3;
  private colorScale;

  constructor(
    d3Service: D3Service,
  ) {
    this.d3 = d3Service.getD3();
  }

  perc2color(perc: number) {
    this.colorScale = this.d3.scaleLinear<string, number>()
      .domain([0, 50])
      .range(["#208ce0", "#7d011b"])
      .interpolate(this.d3.interpolateHcl);
    return this.colorScale(perc);
  }

  perc2color2(avgSpeed: number, limit: number) {cd
    let perc = (avgSpeed / limit) - 1;
    this.colorScale = this.d3.scaleLinear<string, number>()
      .domain([0, 0.2, 1])
      .range(["#d73027", "#fee08b", "#1a9850"])
      .interpolate(this.d3.interpolateHcl);
    return this.colorScale(perc);
  }

  numberToColor(count: number, countMax: number): string {
    let colorScale = this.d3.scaleLinear<string, number>()
      .domain([0, countMax])
      .range(["#fcfcff", "#000000"])
      .interpolate(this.d3.interpolateHcl);
    return colorScale(count);
  }

  numberToOpacity(count: number, countMax: number): number {
    let colorScale = this.d3.scaleLinear<number, number>()
      .domain([0, countMax])
      .range([0, 1]);
    return colorScale(count);
  }
}
