import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {

  api = environment.api + 'auth/';

  private adminSource = new BehaviorSubject<boolean>(false);
  currentAdminState = this.adminSource.asObservable();
  constructor(private http: HttpClient) { }

  requestLogin(): Observable<any> {
    return this.http.get(this.api + 'auth');
  }

  changeAdminState(admin: boolean) {
    this.adminSource.next(admin);
  }
}
