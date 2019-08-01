import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {BaseApi} from '../../../shared/core/base-api';
import {WfmEvent} from '../model/event.model';

@Injectable()
export class EventsService extends BaseApi {

  constructor(protected http: HttpClient) {
    super(http);
  }

  addEvent(event: WfmEvent): Observable<WfmEvent> {
    return this.post('events', event);
  }

  getEvents(): Observable<WfmEvent[]> {
    return this.get('events');
  }

}
