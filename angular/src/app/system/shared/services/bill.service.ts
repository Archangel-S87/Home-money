import {Injectable} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';
import {map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

import {SystemService} from "./system.service";
import {CurrencyRate, CurrenciesRates, ApiResponse} from "../../../shared/types";
import {LocalStorageService} from "../../../shared/services/localStorage.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../shared/services/auth.service";
import {Currencies, UserService} from "../../../shared/services/user.service";

@Injectable()
export class BillService extends SystemService {

  private localCurrencyRates = 'currencyRates'; // Локальное хранилище курсов валют
  private abbrCurrenciesRates = ['RUB', 'USD', 'EUR']; // Валюты отображаемые в кабинете

  public localCurrencyName = 'currencies';

  constructor(
    protected http: HttpClient,
    protected authService: AuthService,
    protected userService: UserService
  ) {
    super(http, authService)
  }

  public getBill(): Observable<BillResponse> {
    return this.get('bill/' + this.authService.user.id);
  }

  public updateBill(bill: Bill): Observable<Bill> {
    return this.get('bill/edit', bill);
  }

  /**
   * Возвращает счёт и курсы валют одновременно
   * @param isBill Получить счёт
   * @param isRates Получить курсы валют
   * @param isForceServerUpdate Принудительно загрузить курсы валют
   */
  public getPageData(isBill = true, isRates = true, isForceServerUpdate = false)
    : Observable<{ [abbr: string]: CurrencyRate & BillResponse }> {

    const sources: { bill?, currencies?: Observable<Currencies>, [abbr: string]: {} } = {};

    if (!LocalStorageService.get('currencies')) {
      sources.currencies = this.userService.getCurrencies();
    }

    if (isBill) {
      sources.bill = this.getBill();
    }
    if (isRates) {
      for (let abbr of this.abbrCurrenciesRates) {
        sources[abbr] = this.getRate(abbr, isForceServerUpdate);
      }
    }

    return forkJoin(sources).pipe(
      map((data) => {
        if (data['currencies']) {
          LocalStorageService.set('currencies', data['currencies']['data']['currencies']);
          delete data['currencies'];
        }
        return data;
      })
    );

  }

  /**
   * Получает курс валюты по переданой аббревиатуре (обновляет localStorage)
   * @param abbrRate Аббревиатура
   * @param isForceServerUpdate Принудительно сделать запрос на удалённый сервер и обновить localStorage
   */
  private getRate(abbrRate, isForceServerUpdate = false): Observable<CurrencyRate> {

    if (!isForceServerUpdate) {
      const rate = this.getLocalRate(abbrRate);
      if (rate) return rate;
    }

    return this.http
      .get('http://www.nbrb.by/API/ExRates/Rates/' + abbrRate + '?ParamMode=2')
      .pipe(
        map((data) => this.setLocalRate({
            id: data['Cur_ID'],
            name: data['Cur_Name'],
            abbreviation: data['Cur_Abbreviation'],
            scale: data['Cur_Scale'],
            officialRate: data['Cur_OfficialRate'],
            date: new Date(data['Date'])
          })
        )
      );

  }

  /**
   * Возвращает курс валюты из localStorage
   * @param abbr
   */
  private getLocalRate(abbr: string): Observable<CurrencyRate> | false {

    let localData: LocalCurrenciesRates | false = LocalStorageService.get(this.localCurrencyRates);
    if (!localData) localData = new LocalCurrenciesRates;

    const rate: CurrencyRate = localData.rates[abbr];

    if (!rate) return false;

    // Нужно ли обновить (прошло больше суток)
    const now = new Date().getTime();
    const today = new Date(localData.date).getTime();

    if (now > today + 24 * 60 * 60 * 1000) { // прошёл день
      return false;
    }

    return of(rate);

  }

  /**
   * Помещает курс валюты в localStorage
   * @param rate
   */
  private setLocalRate(rate: CurrencyRate): CurrencyRate {

    let localData: LocalCurrenciesRates | false = LocalStorageService.get(this.localCurrencyRates);
    if (!localData) localData = new LocalCurrenciesRates;

    localData.rates[rate.abbreviation] = rate;
    localData.date = new Date();

    window.localStorage.setItem(this.localCurrencyRates, JSON.stringify(localData));

    return rate;

  }

}

class LocalCurrenciesRates {
  date: Date;
  rates: CurrenciesRates;

  constructor() {
    this.rates = {};
  }

}

export class Bill {
  bill?: number = 0;
  currency?: string;
  message?: string;
}

export class BillResponse extends ApiResponse {
  data: Bill;
}
