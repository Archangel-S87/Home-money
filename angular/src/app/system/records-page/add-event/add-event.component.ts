import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import {mergeMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

import {EventsService} from '../../shared/services/events.service';
import {Bill, BillService} from '../../shared/services/bill.service';
import {AppEvent, Category, Message} from "../../../shared/types";

@Component({
  selector: 'wfm-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  private bill: Bill;

  currentCategoryId = 1;
  types = [
    {type: 'income', label: 'Доход'},
    {type: 'outcome', label: 'Расход'}
  ];

  message: Message;

  subscriptionGetBill: Subscription;
  subscriptionUpdateBill: Subscription;

  @Input() categories: Category[] = [];

  constructor(private eventsService: EventsService, private billService: BillService) {}

  ngOnInit() {
    this.message = {type: '', text: ''};
  }

  private showMessage(text: string, type: string = 'danger') {
    this.message.text = text;
    this.message.type = type;
    setTimeout(() => this.message.text = '', 5000);
  }

  onSubmit(form: NgForm) {
    const event: AppEvent = {
      type: form.value.type,
      amount: + form.value.amount,
      category: + form.value.category,
      date: moment().format('DD.MM.YYYY HH:mm:ss'),
      description: form.value.description
    };
    if (event.amount < 0) {
      event.amount *= -1;
    }

    this.subscriptionGetBill = this.billService.getBill()
      .subscribe((response) => {

        if (!response.errors) {
          this.bill = response.data;
        }

        if (event.type === 'outcome') {
          if (event.amount > this.bill.bill) {
            this.showMessage('На счету недостаточно средств. Вам не хватает ' + (event.amount - this.bill.bill));
            return;
          } else {
            this.bill.bill -= event.amount;
          }
        } else {
          this.bill.bill += event.amount;
        }

        this.subscriptionUpdateBill = this.billService.updateBill(this.bill)
          .pipe(
            mergeMap(() => this.eventsService.addEvent(event))
          )
          .subscribe(() => {
            if (response.errors) {
              this.eventsService.setErrors(response.data, form);
              return false;
            }
            form.reset({
              type: event.type,
              amount: 0,
              category: event.category,
              description: ''
            });
            this.showMessage('Событие добавлено', 'success');
          });

      });
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetBill) {
      this.subscriptionGetBill.unsubscribe();
    }
    if (this.subscriptionUpdateBill) {
      this.subscriptionUpdateBill.unsubscribe();
    }
  }

}
