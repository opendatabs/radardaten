import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Radar} from "./radar";

@Injectable()
export class DataService {
  // todo:remove this
  private loadSecondData = false;

  constructor(
    private http: HttpClient
  ) { }

  getMapData(): Observable<Radar[]> {
    return this.http.get<Radar[]>('assets/_mockData/data.json');
  }

  getDetailData(): Observable<any[]> {
    this.loadSecondData = !this.loadSecondData;
    if (!this.loadSecondData) {
      return this.http.get<any[]>('assets/_mockData/detailData1.json');
    } else {
      return this.getDetailData2();
    }
  }

  getDetailData2(): Observable<any[]> {
    return this.http.get<any[]>('assets/_mockData/detailData2.json');
  }
}
