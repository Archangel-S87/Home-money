import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {SystemService} from "./system.service";
import {ApiResponse, Category} from "../../../shared/types";

@Injectable()
export class CategoriesService extends SystemService {

  addCategory(category: Category): Observable<CategoryResponse> {
    category.author = this.authService.user.id;
    return this.get('category/add', category);
  }

  getCategoryById(id: string | number): Observable<CategoryResponse> {
    return this.get('category/' + id);
  }

  getCategories(): Observable<CategoriesResponse> {
    return this.get('categories');
  }

  updateCategory(category: Category): Observable<CategoryResponse> {
    return this.get('category/edit/' + category.id, category);
  }

}

export class CategoryResponse extends ApiResponse {
  data: Category
}

export class CategoriesResponse extends ApiResponse {
  data: Category[]
}
