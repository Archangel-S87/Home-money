import {Component, Input, OnInit} from '@angular/core';

import {Bill} from "../../shared/services/bill.service";
import {CurrenciesRates} from "../../../shared/types";
import {LocalStorageService} from "../../../shared/services/localStorage.service";

@Component({
  selector: 'wfm-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {

  @Input() bill: Bill;
  @Input() currenciesRates: CurrenciesRates;

  private mainScore = 'BYN';

  bills: { name: string, val: number, active: boolean }[] = [];

  ngOnInit() {

    const currenciesRates = Object.assign({
      [this.mainScore]: {
        abbreviation: this.mainScore,
        date: new Date(),
        id: 0,
        name: 'Белорусский рублей',
        officialRate: 1,
        scale: 1
      }
    }, this.currenciesRates);

    // Счёт не в BYN
    if (this.bill.currency !== this.mainScore) {
      const curRate = currenciesRates[this.bill.currency];
      this.bill.bill = this.bill.bill * curRate.officialRate / curRate.scale;
    }

    for (const currency of LocalStorageService.get('currencies')) {

      const currencyRate = currenciesRates[currency];
      const bill = {
        name: currency,
        active: false,
        val: this.bill.bill * currencyRate.scale / currencyRate.officialRate
      };

      if (this.bill.currency === currency) {
        bill.active = true;
        this.bills.unshift(bill)
      } else {
        this.bills.push(bill);
      }

    }

  }

}
