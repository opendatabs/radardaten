import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Radar } from './radar';


@Injectable()
export class RadarService {

  api = environment.api + 'radar/';

  constructor(
    private http: HttpClient
  ) { }

  getRadars(): Observable<Radar[]> {
    return this.http.get<Radar[]>(this.api);
  }

  getRadar(id: number): Observable<Radar> {
    return this.http.get<Radar>(this.api + id);
  }

  addRadar(radar: object): Observable<object> {
    return this.http.post<object>(this.api + 'addRadar', radar);
  }

  updateRadar(radar: Radar): Observable<Radar> {
    return this.http.put<Radar>(this.api + 'updateRadar', radar);
  }

  deleteRadar(radar: Radar): Observable<Radar> {
    return this.http.delete<Radar>(this.api + radar.id);
  }

  getRadarWithAvgSpeedAndSpeedingQuote(): Observable<Radar[]> {
    return this.http.get<Radar[]>(this.api + 'radarWithAvgSpeedAndSpeedingQuote');
  }

  updateRecordCount(radar: Radar): Observable<any> {
    return this.http.put<Radar>(this.api + 'updateRecordCount', radar);
  }
}
