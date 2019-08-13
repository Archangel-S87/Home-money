import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {BaseApi} from '../core/base-api';
import {ApiResponse, User} from "../types";

@Injectable()
export class UserService extends BaseApi {

  login(email: string, password: string): Observable<ResponseAuth> {
    return this.get('login', {email, password});
  }

  getUserByEmail(email: string): Observable<IsEmail> {
    return this.get('is-email', {email});
  }

  createNewUser(user: User): Observable<ResponseAuth> {
    return this.get('registration', user);
  }

  getCurrencies(): Observable<Currencies> {
    return this.get('currencies');
  }

}

export class Currencies extends ApiResponse {
  data: {
    currencies: string[]
  }
}

class ResponseAuth extends ApiResponse {
  data: {
    message?: string,
    user?: User
  }
}

class IsEmail extends ApiResponse {
  data: {
    is_email?: boolean,
  }
}
