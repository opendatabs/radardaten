import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Record } from './record';


@Injectable()
export class RecordService {

  api = environment.api + 'record/';

  constructor(
    private http: HttpClient
  ) { }

  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.api);
  }

  getRecord(id: number): Observable<Record> {
    return this.http.get<Record>(this.api + id);
  }

  addRecord(record: Record): Observable<Record> {
    return this.http.post<Record>(this.api, record);
  }

  updateRecord(record: Record): Observable<Record> {
    return this.http.patch<Record>(this.api + record.id, record);
  }

  deleteRecord(record: Record): Observable<Record> {
    return this.http.delete<Record>(this.api + record.id);
  }

}
