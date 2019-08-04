import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class BaseApi {

  protected baseUrl = '/api/';

  constructor(protected http: HttpClient) {
    if (window.location.host.indexOf('localhost') !== -1) {
      this.baseUrl = '//home-money.loc' + this.baseUrl;
    }
  }

  public get(url: string = '', data: {} = {}, isBaseUrl: boolean = true): Observable<any> {
    url = isBaseUrl ? this.baseUrl + url : url;
    url += BaseApi.transformData(data);
    return this.http.get(url);
  }

  static transformData(data: {}) {

    if (!Object.keys(data).length) return '';

    let str = '?',
        count = 0;

    for (let key in data) {
      if (!data[key]) continue;
      if (count++) str += '&';
      str += key + '=' + encodeURIComponent(data[key]);
    }

    return str;

  }

  public post(url: string = '', data: any = {}): Observable<any> {
    return this.http.post(this.getUrl(url), data);
  }

  public put(url: string = '', data: any = {}): Observable<any> {
    return this.http.put(this.getUrl(url), data);
  }

  private getUrl(url: string = ''): string {
    return this.baseUrl + url;
  }

}
