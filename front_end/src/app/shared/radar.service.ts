import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Radar } from './radar';


@Injectable()
export class RadarService {

  api = environment.api;

  constructor(
    private http: HttpClient
  ) { }

  getRadars(): Observable<Radar[]> {
    return this.http.get<Radar[]>(this.api);
  }

  getIndicator(id: number): Observable<Radar> {
    return this.http.get<Radar>(this.api + id);
  }

  addIndicator(radar: Radar): Observable<Radar> {
    return this.http.post<Radar>(this.api, radar);
  }

  updateIndicator(radar: Radar): Observable<Radar> {
    return this.http.patch<Radar>(this.api + radar.id, radar);
  }

  deleteIndicator(radar: Radar): Observable<Radar> {
    return this.http.delete<Radar>(this.api + radar.id);
  }

}
