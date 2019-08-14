import {Injectable} from "@angular/core";
import {BaseApi} from "../../../shared/core/base-api";
import {Observable} from "rxjs";
import {NgForm} from "@angular/forms";

@Injectable()
export class SystemService extends BaseApi {

  private prefixUrl = 'system/';
  private messages = 'messages';

  protected get(url = '', data = {}): Observable<any> {
    url = this.prefixUrl + url;
    return super.get(url, data);
  }

  public setErrors(fields, form: NgForm): void {

    for (const key in fields) {

      const field = form.form.get(key),
        messages = fields[key][this.messages],
        errors = {};

      if (!field || messages.isArray) return;

      for (const error in messages) {
        errors[error] = true;
      }

      field.setErrors(errors);

    }

  }

}
