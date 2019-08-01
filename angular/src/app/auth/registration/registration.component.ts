import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'wfm-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
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
      name: new FormControl(null, [Validators.required]),
      agree: new FormControl(false, [Validators.requiredTrue])
    });
  }

  onSubmit() {
    console.log(this.form);
    const {email, password, name} = this.form.value;
    const user = new User(email, password, name);
    this.userService
      .createNewUser(user)
      .subscribe(() => {
        return this.router.navigate(['/login'], {
          queryParams: {
            nowCanLogin: true
          }
        });
      });
  }

  forbiddenEmails(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      this.userService
        .getUserByEmail(control.value)
        .subscribe((user: User) => resolve(user ? {forbiddenEmail: true} : null));
    });
  }

}
