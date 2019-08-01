import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../shared/services/categories.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {Category} from '../../shared/model/category.model';
import {Message} from '../../../shared/models/message.model';

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
    this.message = new Message('success', '');
    this.onCategoryChange();
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
      .subscribe((editCategory: Category) => {
        this.wfmNnCategoryEdit.emit(editCategory);
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
