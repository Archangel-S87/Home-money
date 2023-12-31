import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Bill, BillService} from '../shared/services/bill.service';
import {CurrenciesRates} from "../../shared/types";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'wfm-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {

  bill: Bill;
  currenciesRates: CurrenciesRates;

  subscriptionStart: Subscription;
  subscriptionRefresh: Subscription;

  isLoaded = false;

  constructor(private billService: BillService, public title: Title) {
    title.setTitle('Счёт');
  }

  ngOnInit() {
    this.subscriptionStart = this.billService
      .getPageData()
      .subscribe((data) => {

        if (!data.bill.errors) {
          this.bill = data.bill.data;
        }

        delete data.bill;
        this.currenciesRates = data;

        this.isLoaded = true; // Отображаю содержимое страницы

      });
  }

  onRefresh() {
    this.isLoaded = false;
    this.subscriptionRefresh = this.billService.getPageData(false,true, true)
      .subscribe((data) => {
        this.currenciesRates = data;
        this.isLoaded = true;
      });
  }

  ngOnDestroy(): void {
    this.subscriptionStart.unsubscribe();
    if (this.subscriptionRefresh) {
      this.subscriptionRefresh.unsubscribe();
    }
  }

}
