import {Component, OnInit} from '@angular/core';
import {CategoriesService} from '../shared/services/categories.service';
import {Category} from "../../shared/types";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'wfm-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {

  isLoaded = false;
  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService, private title: Title) {
    title.setTitle('Записи');
  }

  ngOnInit() {
    this.categoriesService.getCategories()
      .subscribe((categories) => {
        if (categories.errors) return false;
        this.categories = categories.data;
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
