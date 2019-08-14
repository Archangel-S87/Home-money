import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {AuthService} from "../services/auth.service";

@Injectable()
export class BaseApi {

  protected url = '/api/';

  constructor(protected http: HttpClient, protected authService: AuthService) {
    // Для запуска api на локальном сервре
    if (window.location.host.indexOf('localhost') !== -1) {
      this.url = 'http://home-money.loc' + this.url;
    }
  }

  protected get(url = '', data = {}): Observable<any> {

    url = this.getUrl(url);
    url += this.transformData(data);

    return this.http.get(url);

  }

  private getUrl(url: string): string {
    url = this.url + url;
    // Убираю двойные слеши из url
    url = url.replace(/(^|[^:])[/]{2,}/g, '$1/');
    // Убираю последний слеш с конца
    url = url.replace(/[/]$/, '');
    return url;
  }

  private transformData(data: {}) {

    // Если пользователь авторизован добавляю token
    if (this.authService.user) {
      data['token'] = this.authService.user.token;
    }

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

}
