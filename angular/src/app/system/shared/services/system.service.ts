import {Injectable} from "@angular/core";
import {BaseApi} from "../../../shared/core/base-api";
import {Observable} from "rxjs";

@Injectable()
export class SystemService extends BaseApi {

  private prefixUrl = 'system/';

  protected get(url = '', data = {}): Observable<any> {
    url = this.prefixUrl + url;
    return super.get(url, data);
  }

}
