import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Record } from './record';


@Injectable()
export class RecordService {

  api = environment.api;

  constructor(
    private http: HttpClient
  ) { }

  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.api);
  }

  getIndicator(id: number): Observable<Record> {
    return this.http.get<Record>(this.api + id);
  }

  addIndicator(record: Record): Observable<Record> {
    return this.http.post<Record>(this.api, record);
  }

  updateIndicator(record: Record): Observable<Record> {
    return this.http.patch<Record>(this.api + record.id, record);
  }

  deleteIndicator(record: Record): Observable<Record> {
    return this.http.delete<Record>(this.api + record.id);
  }

}
