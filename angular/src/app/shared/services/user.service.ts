import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {User} from '../models/user.model';
import {BaseApi} from '../core/base-api';

@Injectable()
export class UserService extends BaseApi {

  constructor(protected http: HttpClient) {
    super(http);
  }

  login(email: string, password: string): Observable<{}>  {
    return this.get('login', {email, password});
  }

  getUserByEmail(email: string): Observable<{errors: boolean, is_email: boolean}> {
    return this.get('is-email', {email});
  }

  createNewUser(user: User): Observable<{}> {
    return this.get('registration', user);
  }

  getCurrencies(): Observable<string[]> {
    return this.get('currencies');
  }

}
