export class LocalStorageService {

  public static set(key, data): void {
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  public static get(key): any {
    const localRates: string | undefined = window.localStorage.getItem(key);
    return (localRates && localRates.length) ? JSON.parse(localRates) : false;
  }

}
