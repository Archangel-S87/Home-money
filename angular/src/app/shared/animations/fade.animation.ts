import {animate, style, transition, trigger} from "@angular/animations";

export const fadeStateTrigger = trigger('fade', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(500)
  ]),
  transition(':leave', animate(10, style({
    opacity: 0
  })))
]);

export const fadeStateTriggerMessage = trigger('fadeMessage', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(500)
  ]),
  transition(':leave', animate(500, style({
    opacity: 0
  })))
]);
