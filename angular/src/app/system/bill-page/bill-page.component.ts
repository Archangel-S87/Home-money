import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Bill, BillService} from '../shared/services/bill.service';
import {CurrenciesRates} from "../../shared/types";

@Component({
  selector: 'wfm-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {

  private bill: Bill;
  private currenciesRates: CurrenciesRates;

  private subscriptionStart: Subscription;
  private subscriptionRefresh: Subscription;

  private isLoaded = false;

  constructor(private billService: BillService) {}

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
