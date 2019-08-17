import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Subscription} from "rxjs";
import * as moment from "moment";

import {HistoryChartComponent} from "./history-chart/history-chart.component";
import {AppEvent, Category} from "../../shared/types";
import {CategoriesService} from "../shared/services/categories.service";
import {EventsService} from "../shared/services/events.service";
import {unitOfTime} from "moment";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'wfm-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  @ViewChild(HistoryChartComponent, {static: false}) historyChartComponent: HistoryChartComponent;

  private isLoaded = false;
  private subscribe: Subscription;

  protected categories: Category[] = [];
  protected events: AppEvent[] = [];
  protected filteredEvents: AppEvent[] = [];

  isFilterVisible = false;

  constructor(
    private categoriesService: CategoriesService,
    private eventsService: EventsService,
    private title: Title
  ) {
    title.setTitle('История');
  }

  ngOnInit() {
    this.subscribe = forkJoin({
      categories: this.categoriesService.getCategories(),
      events: this.eventsService.getEvents()
    }).subscribe((response) => {
      if (response.categories.errors || response.events.errors) {
        return false;
      }
      this.categories = response.categories.data;
      this.events = response.events.data;
      this.setOriginalEvents();
      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  onFilterApply(filterData: { period: unitOfTime.StartOf, types: Set<string>, categories: Set<string> }) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents = this.filteredEvents
      .filter((e) => filterData.types.has(e.type))
      .filter((e) => filterData.categories.has(e.category.toString()))
      .filter((e) => {
        const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
        return momentDate.isBetween(startPeriod, endPeriod);
      });
    this.resetChart();
  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.resetChart();
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  private resetChart() {
    // Работает только так. Иначен график не перерисовывается
    setTimeout(() => {
      this.historyChartComponent.ngOnInit();
    }, 500);
  }

}
