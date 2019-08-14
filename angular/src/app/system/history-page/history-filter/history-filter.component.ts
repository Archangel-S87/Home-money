import {Component, EventEmitter, Input, Output} from '@angular/core';
import {unitOfTime} from "moment";

import {Category} from "../../../shared/types";

@Component({
  selector: 'wfm-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent {

  @Output() onFilterCancel = new EventEmitter<any>();
  @Output() onFilterApply = new EventEmitter<any>();

  @Input() categories: Category[] = [];

  selectedPeriod: unitOfTime.StartOf = 'd';
  selectedTypes = new Set;
  selectedCategories = new Set;

  periods: { type: unitOfTime.StartOf, label: string }[] = [
    {type: 'd', label: 'День'},
    {type: 'w', label: 'Неделя'},
    {type: 'M', label: 'Месяц'}
  ];

  types: { type: string, label: string }[] = [
    {type: 'income', label: 'Доход'},
    {type: 'outcome', label: 'Расход'}
  ];

  closeFilter() {
    this.selectedPeriod = 'd';
    this.selectedTypes.clear();
    this.selectedCategories.clear();
    this.onFilterCancel.emit();
  }

  applyFilter() {
    this.onFilterApply.emit({
      period: this.selectedPeriod,
      types: this.selectedTypes,
      categories: this.selectedCategories
    });
  }

  handleChangeType(target) {
    this.changeSet('selectedTypes', target);
  }

  handleChangeCategory(target) {
    this.changeSet('selectedCategories', target);
  }

  private changeSet(field: string, target) {
    const {checked, value} = target;
    if (checked) {
      this[field].add(value);
    } else {
      this[field].delete(value)
    }
  }

}
