import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BaseApi} from '../../../shared/core/base-api';
import {Category} from '../model/category.model';
import {Observable} from 'rxjs';

@Injectable()
export class CategoriesService extends BaseApi {

  constructor(protected http: HttpClient) {
    super(http);
  }

  addCategory(category: Category): Observable<Category> {
    return this.post('categories', category);
  }

  getCategories(): Observable<Category[]> {
    return this.get('categories');
  }

  updateCategory(category: Category): Observable<Category> {
    return this.put('categories/' + category.id, category);
  }

}
