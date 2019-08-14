import {Component, Input, OnInit} from '@angular/core';
import {AppEvent, Category} from "../../../shared/types";

@Component({
  selector: 'wfm-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.scss']
})
export class HistoryChartComponent implements OnInit {

  @Input() categories: Category[];
  @Input() events: AppEvent[];

  data: { name: string, value: number }[] = [];

  ngOnInit(): void {
    this.data = [];
    this.categories.forEach((cat) => {
      const catEvent = this.events.filter((e) => e.category === cat.id && e.type === "outcome");
      this.data.push({
        name: cat.name,
        value: catEvent.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });
    });
  }

}
