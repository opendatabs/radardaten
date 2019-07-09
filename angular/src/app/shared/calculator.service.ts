import { Injectable } from '@angular/core';
import { Record } from "./record";

@Injectable()
export class CalculatorService {

  constructor() { }

  calculateAvgSpeed(records: Record[], direction?: number) {
      let sum = 0, count = 0;
      records.forEach(r => {
        if (r.direction === direction || !direction) {
          count++;
          sum += r.kmh;
        }
      });
      return Math.round(sum / count * 100) / 100;
  }

}
