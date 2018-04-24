import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

  constructor() { }

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

}
