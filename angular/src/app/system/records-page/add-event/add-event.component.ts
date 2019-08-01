import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import {mergeMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

import {WfmEvent} from '../../shared/model/event.model';
import {Category} from '../../shared/model/category.model';
import {EventsService} from '../../shared/services/events.service';
import {BillService} from '../../shared/services/bill.service';
import {Bill} from '../../shared/model/bill.model';
import {Message} from '../../../shared/models/message.model';

@Component({
  selector: 'wfm-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

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
    this.message = new Message('danger', '');
  }

  private showMessage(text: string) {
    this.message.text = text;
    setTimeout(() => this.message.text = '', 5000);
  }

  onSubmit(form: NgForm) {
    const event: WfmEvent = {
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
      .subscribe((bill: Bill) => {

        if (event.type === 'outcome') {
          if (event.amount > bill.value) {
            this.showMessage('На счету недостаточно средств. Вам не хватает ' + (event.amount - bill.value));
            return;
          } else {
            bill.value -= event.amount;
          }
        } else {
          bill.value += event.amount;
        }

        this.subscriptionUpdateBill = this.billService.updateBill(bill)
          .pipe(mergeMap(() => this.eventsService.addEvent(event)))
          .subscribe(() => {
            form.reset({
              type: event.type,
              amount: 0,
              category: event.category,
              description: ''
            });
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
