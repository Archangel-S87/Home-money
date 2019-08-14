import {Pipe, PipeTransform} from "@angular/core";
import {AppEvent, Category} from "../../../shared/types";

@Pipe({
  name: 'wfmFilterEvents'
})
export class FilterEventsPipe implements PipeTransform {

  transform(items: AppEvent[], value: string, field: string, categories: Category[]): AppEvent[] {
    if (!items.length || !value) return items;
    return items.filter((i) => {

      if (field === 'category') {
        const c = categories.find((cat) => getIndex(cat.name, value));
        return c ? i.category === c.id : false;
      }

      const t = Object.assign({}, i);
      t[field] += '';

      if (field === 'type') {
        if (getIndex('Доход', value)) {
          return t[field] === 'income';
        } else if (getIndex('Расход', value)) {
          return t[field] === 'outcome';
        }
      }

      return getIndex(t[field], value);

      // Ищет в строке подстраку
      function getIndex(str, value) {
        return str.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }

    });
  }

}
