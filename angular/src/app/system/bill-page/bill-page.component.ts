import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {Observable, Subscription} from 'rxjs';
import {Bill} from '../shared/model/bill.model';
import {Currency} from '../shared/model/currency.model';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'wfm-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {

  bill: Bill;
  currenciesAbbr: string[] = ['RUB', 'USD', 'EUR'];
  currency: Currency[];

  subscriptionStart: Subscription;
  subscriptionRefresh: Subscription;

  isLoaded = false;

  constructor(private billService: BillService) {}

  private getFork({bill: bill, currencies: currencies, isForceServerUpdate}:
      {bill?: boolean, currencies?: string[], isForceServerUpdate?: boolean}): Observable<any> {
    const sources = [];
    if (bill) {
      sources.push(this.billService.getBill());
    }
    if (currencies) {
      for (const currency of currencies) {
        sources.push(this.billService.getCurrency(currency, isForceServerUpdate));
      }
    }
    return forkJoin(sources);
  }

  ngOnInit() {
    this.subscriptionStart = this.getFork({bill: true, currencies: this.currenciesAbbr})
      .subscribe((data: any[]) => {
        this.bill = data.shift();
        this.currency = data;
        this.isLoaded = true;
      });
  }

  onRefresh() {
    this.isLoaded = false;
    this.subscriptionRefresh = this.getFork({currencies: this.currenciesAbbr, isForceServerUpdate: true})
      .subscribe((data: any[]) => {
        this.currency = data;
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
