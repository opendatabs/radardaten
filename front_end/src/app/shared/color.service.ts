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

  perc2color(perc): string {
    let r, g, b = 0;
    if(perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    let h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

  perc2color2(perc: number) {
    this.colorScale = this.d3.scaleLinear<string, number>()
      .domain([0, 50, 100])
      .range(["#d73027", "#fee08b", "#1a9850"])
      .interpolate(this.d3.interpolateHcl);
    return this.colorScale(perc);
  }

}
