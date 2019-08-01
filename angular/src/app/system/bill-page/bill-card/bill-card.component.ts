import {Component, Input, OnInit} from '@angular/core';

import {Bill} from '../../shared/model/bill.model';
import {Currency} from '../../shared/model/currency.model';

@Component({
  selector: 'wfm-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {

  @Input() bill: Bill;
  @Input() currency: Currency[];

  RUB: number;
  USD: number;

  ngOnInit() {
    for (const currency of this.currency) {
      this[currency.abbreviation] = this.bill.value * currency.scale / currency.officialRate;
    }
  }

}
