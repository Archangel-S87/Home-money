import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {mergeMap} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";

import {EventsService} from "../../shared/services/events.service";
import {CategoriesService, CategoryResponse} from "../../shared/services/categories.service";
import {ApiResponse, AppEvent, Category, User} from "../../../shared/types";
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'wfm-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  isLoaded = false;

  user: User;
  event: AppEvent;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
  ) {}

  ngOnInit() {

    this.user = this.authService.user;

    this.subscription = this.route.params.pipe(
      mergeMap((params: Params) => {
        return this.eventsService.getEventById(params.id)
      }),
      mergeMap((response) => {
        if (response.errors) return of(new ApiResponse());
        this.event = response.data;
        return this.categoriesService.getCategoryById(this.event.category);
      })
    ).subscribe((response: CategoryResponse) => {
      if (response.errors) return false;
      this.category = response.data;
      this.isLoaded = true;
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
