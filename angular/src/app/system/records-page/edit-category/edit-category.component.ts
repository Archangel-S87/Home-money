import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../shared/services/categories.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {Category, Message} from "../../../shared/types";

@Component({
  selector: 'wfm-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  currentCategoryId = 1;
  currentCategory: Category;

  message: Message;

  subscription: Subscription;

  @Input() categories: Category[] = [];

  @Output() wfmNnCategoryEdit = new EventEmitter<Category>();

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.message = {type: 'success', text: ''};
    this.onCategoryChange();
    this.currentCategory = new Category();
  }

  onCategoryChange() {
    this.currentCategory = this.categories.find((c) => c.id === + this.currentCategoryId);
  }

  onSubmit(form: NgForm) {
    const category: Category = {
      name: form.value.name,
      capacity: form.value.capacity,
      id: this.currentCategoryId
    };
    if (category.capacity < 0) {
      category.capacity *= -1;
    }
    this.subscription = this.categoriesService.updateCategory(category)
      .subscribe((response) => {
        if (response.errors) {
          this.categoriesService.setErrors(response.data, form);
          return false;
        }
        this.wfmNnCategoryEdit.emit(response.data);
        this.message.text = 'Категория сохранена';
        setTimeout(() => this.message.text = '', 5000);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
