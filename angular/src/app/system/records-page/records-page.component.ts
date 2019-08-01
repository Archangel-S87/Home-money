import { Component, OnInit } from '@angular/core';
import {Category} from '../shared/model/category.model';
import {CategoriesService} from '../shared/services/categories.service';

@Component({
  selector: 'wfm-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {

  isLoaded = false;
  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.getCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        this.isLoaded = true;
      });
  }

  newCategoryAdd(category: Category) {
    this.categories.push(category);
  }

  categoryEdit(category: Category) {
    this.categories.find((elem, index, arr) => {
      if (elem.id === category.id) {
        arr[index] = category;
        return true;
      }
      return false;
    });
  }

}
