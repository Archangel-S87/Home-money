/**
 * Пользователь в системе
 */
export class User {
  id?: number;
  email: string;
  password?: string;
  name: string;
  bill?: number;
  currency?: string;
  token?: string;
}

/**
 * Всплывающие сообщения
 */
export class Message {
  type: string;
  text: string;
}

/**
 * Ответы сервера
 */
export class ApiResponse {
  errors: boolean;
  data?: {};
}

/**
 * Курс валюты
 */
export class CurrencyRate {
  id: number;
  abbreviation: string;
  name: string;
  scale: number;
  officialRate: number;
  date: Date;
}

/**
 * Курсы валют
 */
export class CurrenciesRates {
  [abbr: string]: CurrencyRate;

  public static add(data: CurrencyRate): void {
    this[data.abbreviation] = data;
  }
}

/**
 * Категория слбытия
 */
export class Category {
  id?: number;
  name: string;
  capacity: number;
  author?: number;
}

/**
 * Событие
 */
export class AppEvent {
  id?: number;
  type: string;
  amount: number;
  category: number;
  date: string;
  description: string;
  author?: number;
}
