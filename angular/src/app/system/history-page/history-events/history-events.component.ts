import {Component, Input, OnInit} from '@angular/core';
import {AppEvent, Category} from "../../../shared/types";

@Component({
  selector: 'wfm-history-events',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.scss']
})
export class HistoryEventsComponent {

  @Input() categories: Category[];
  @Input() events: AppEvent[];

  nameMap = {
    amount: 'Суииа',
    date: 'Дата',
    category: 'Категория',
    type: 'Тип'
  };

  searchValue = '';
  searchField = 'amount';

  getEventCatName(e: AppEvent): string {
    const cat = this.categories.find((cat) => cat.id === e.category);
    return cat ? cat.name : '';
  }

  getEventClass(e: AppEvent) {
    return {
      'label-danger': e.type === 'outcome',
      'label-success': e.type === 'income'
    }
  }

}
