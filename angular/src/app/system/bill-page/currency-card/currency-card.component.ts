import {Component, Input} from '@angular/core';
import {CurrenciesRates} from "../../../shared/types";

@Component({
  selector: 'wfm-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})
export class CurrencyCardComponent {

  @Input() currenciesRates: CurrenciesRates;

}
