export class Currency {
  constructor(
    public id: number,
    public abbreviation: string,
    public name: string,
    public scale: number,
    public officialRate: number,
    public date: Date
  ) {}
}
