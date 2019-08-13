import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Bill, BillService} from '../shared/services/bill.service';
import {AuthService} from "../../shared/services/auth.service";
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

  constructor(private billService: BillService, private authService: AuthService) {}

  ngOnInit() {
    // TODO Убрать перед продакшеном
    let localUser = window.localStorage.getItem('user');
    if (!this.authService.user && localUser) {
      this.authService.user = JSON.parse(localUser);
    }

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
