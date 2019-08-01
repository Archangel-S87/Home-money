import {Component, Input, OnInit} from '@angular/core';
import {Currency} from '../../shared/model/currency.model';

@Component({
  selector: 'wfm-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})
export class CurrencyCardComponent implements OnInit {

  @Input() currency: Currency[];

  constructor() {}

  ngOnInit() {

  }

}
