import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {SystemService} from "./system.service";
import {ApiResponse, AppEvent} from "../../../shared/types";

@Injectable()
export class EventsService extends SystemService {

  addEvent(event: AppEvent): Observable<AppEventResponse> {
    return this.get('event/add', event);
  }

  getEvents(): Observable<AppEventsResponse> {
    return this.get('events');
  }

}

class AppEventResponse extends ApiResponse{
  data: AppEvent;
}

class AppEventsResponse extends ApiResponse{
  data: AppEvent[];
}
