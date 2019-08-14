import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {UserService} from '../../shared/services/user.service';
import {User} from "../../shared/types";
import {LocalStorageService} from "../../shared/services/localStorage.service";

@Component({
  selector: 'wfm-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private form: FormGroup;

  protected currencies: string[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.getCurrencies();
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ], [
        this.forbiddenEmails.bind(this)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      currency: new FormControl(null, [Validators.required]),
      agree: new FormControl(false, [Validators.requiredTrue])
    });
  }

  onSubmit() {
    const {email, password, name, currency} = this.form.value;
    const user: User = {email, password, name, currency};
    this.userService
      .createNewUser(user)
      .subscribe((response) => {
        if (response.errors) {
          this.setErrors(response);
        } else {
          return this.router.navigate(['/login'], {
            queryParams: {
              nowCanLogin: true
            }
          });
        }
      });
  }

  forbiddenEmails(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      this.userService
        .getUserByEmail(control.value)
        .subscribe((response) => resolve(response.data.is_email ? {forbiddenEmail: true} : null));
    });
  }

  private getCurrencies(): any {
    this.userService
        .getCurrencies()
        .subscribe((currencies) => {
          this.currencies = currencies.data.currencies;
          LocalStorageService.set('currencies', this.currencies);
        });
  }

  private setErrors(fields): void {

    for (let key in fields) {

      const field = this.form.get(key),
          messages = fields[key]['messages'],
          errors = {};

      if (!field || messages.isArray) return;

      for (let error in messages) {
        errors[error] = true;
      }

      field.setErrors(errors);

    }

  }

}
