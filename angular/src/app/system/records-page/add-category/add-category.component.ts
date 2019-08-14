import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {CategoriesService} from '../../shared/services/categories.service';
import {Category} from "../../../shared/types";

@Component({
  selector: 'wfm-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnDestroy {

  capacityDefault = 0;

  subscription: Subscription;

  @Output() wfmNnCategoryAdd = new EventEmitter<Category>();

  constructor(private categoriesService: CategoriesService) { }

  onSubmit(form: NgForm) {
    const category: Category = {
      name: form.value.name,
      capacity: form.value.capacity
    };
    if (category.capacity < 0) {
      category.capacity *= -1;
    }
    this.subscription = this.categoriesService.addCategory(category)
      .subscribe((response) => {
        if (response.errors) {
          this.categoriesService.setErrors(response.data, form);
          return false;
        }
        form.reset({capacity: this.capacityDefault});
        this.wfmNnCategoryAdd.emit(response.data);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
