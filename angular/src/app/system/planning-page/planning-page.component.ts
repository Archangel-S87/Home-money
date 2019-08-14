import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';

import {Bill, BillService} from '../shared/services/bill.service';
import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {AppEvent, Category} from "../../shared/types";

@Component({
  selector: 'wfm-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {

  isLoaded = false;

  bill: Bill;
  categories: Category[] = [];
  events: AppEvent[] = [];

  subscription: Subscription;

  constructor(
    private billService: BillService,
    private categoriesService: CategoriesService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.subscription = forkJoin({
        bill: this.billService.getBill(),
        categories: this.categoriesService.getCategories(),
        events: this.eventsService.getEvents()
    }).subscribe((data) => {
      this.bill = data.bill.data;
      this.categories = data.categories.data;
      this.events = data.events.data;
      this.isLoaded = true;
    });
  }

  getCategoryCost(cat: Category): number {
    const catEvents = this.events.filter(e => e.category === cat.id && e.type === 'outcome');
    return catEvents.reduce((total, e) => {
      return total + e.amount;
    }, 0);
  }

  private getPercent(cat: Category): number {
    const percent = 100 * this.getCategoryCost(cat) / cat.capacity;
    return percent > 100 ? 100 : percent;
  }

  getCategoryPercent(cat: Category): string {
    return this.getPercent(cat) + '%';
  }

  getCategoryColorClass(cat: Category): string {
    const percent = this.getPercent(cat);
    return percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
