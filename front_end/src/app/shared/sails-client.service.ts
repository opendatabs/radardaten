import { Injectable } from '@angular/core';
import { SailsService } from 'angular2-sails';
import { Observable } from 'rxjs/Observable';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class SailsClientService {

  constructor(
    private sailsService: SailsService,
  ) { }

  request(options): Observable<any> {
    return this.sailsService.request(options)
      .pipe(map((res) => (<any>(res)).data));
  }

  get(url, data?, headers?): Observable<any> {
    const options = { url, data, headers, method: 'get' };
    return this.request(options);
  }

  post(url, data, headers?): Observable<any> {
    const options = { url, data, headers, method: 'post' };
    return this.request(options);
  }

  patch(url, data, headers?): Observable<any> {
    const options = { url, data, headers, method: 'patch' };
    return this.request(options);
  }

  delete(url, headers?): Observable<any> {
    const options = { url, headers, method: 'delete' };
    return this.request(options);
  }

  /**
 * Listen to Socket events
 * @param event Socket event name
 */
  on<T>(event): Observable<T> {
    return this.sailsService.on(event)
      .pipe(map((res) => (<any>(res)).data));
  }

  // bc(event): Observable<any> {
  //   return this.on(event);
  // }
  /**
   * Unsubscribe from each connected socket room
   */
  off(): Observable<any> {
    return this.post('/Recrod/socket/off', {});
  }
}
