import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs/internal/observable/of';

import {BaseApi} from '../../../shared/core/base-api';
import {map} from 'rxjs/operators';
import {Currency} from '../model/currency.model';
import {Observable} from 'rxjs';
import {Bill} from '../model/bill.model';

@Injectable()
export class BillService extends BaseApi {

  localCurrencyName = 'currencies';

  constructor(protected http: HttpClient) {
    super(http);
  }

  getBill() {
    return this.get('bill');
  }

  updateBill(bill: Bill): Observable<Bill> {
    return this.put('bill', bill);
  }

  getCurrency(abbreviation: string, isForceServerUpdate = false) {

    if (!isForceServerUpdate) {
      const obj = this.getLocalCurrency(abbreviation);
      if (obj) {
        return obj;
      }
    }

    return this
      .get('http://www.nbrb.by/API/ExRates/Rates/' + abbreviation + '?ParamMode=2', false)
      .pipe(map((data: {}): Currency => {
        const cur: Currency = {
          id: data['Cur_ID'],
          name: data['Cur_Name'],
          abbreviation: data['Cur_Abbreviation'],
          scale: data['Cur_Scale'],
          officialRate: data['Cur_OfficialRate'],
          date: new Date(data['Date'])
        };
        this.setLocalCurrency(cur);
        return cur;
      }));

  }

  getLocalCurrency(abbreviation: string) {

    const localData: any = this.getLocalCurrencyData();

    const currency = localData[this.localCurrencyName].find((elem: Currency) => elem.abbreviation === abbreviation);

    // Проверить дату создания
    if (!localData.date || !currency) {
      return false;
    }

    // Нужно ли обновить (прошло больше суток)
    const now = new Date().getTime();
    const today = new Date(localData.date).getTime();

    if (now > today + 24 * 60 * 60 * 1000) { // прошёл день
      return false;
    }

    return of(currency);

  }

  setLocalCurrency(currency: Currency): void {

    const localData: any = this.getLocalCurrencyData();

    if (!localData[this.localCurrencyName].find(updateElem)) {
      localData[this.localCurrencyName].push(currency);
    }

    localData.date = new Date();

    window.localStorage.setItem(this.localCurrencyName, JSON.stringify(localData));

    function updateElem(elem, index, arr) {
      if (elem.abbreviation === currency.abbreviation) {
        arr[index] = currency;
        return true;
      }
      return false;
    }

  }

  getLocalCurrencyData(): {} {
    const localData: any = window.localStorage.getItem(this.localCurrencyName);
    return  localData && localData.length ? JSON.parse(localData) : {currencies: [], date: ''};
  }

}

