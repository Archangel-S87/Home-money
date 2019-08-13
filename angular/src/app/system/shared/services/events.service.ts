import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {BaseApi} from '../../../shared/core/base-api';
import {WfmEvent} from '../model/event.model';
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {SystemService} from "./system.service";

@Injectable()
export class EventsService extends SystemService {

  addEvent(event: WfmEvent): Observable<WfmEvent> {
    return this.post('events', event);
  }

  getEvents(): Observable<WfmEvent[]> {
    return this.get('events');
  }

}
