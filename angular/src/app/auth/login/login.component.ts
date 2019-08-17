import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {UserService} from '../../shared/services/user.service';
import {AuthService} from '../../shared/services/auth.service';
import {Message, User} from "../../shared/types";
import {LocalStorageService} from "../../shared/services/localStorage.service";
import {fadeStateTriggerMessage} from "../../shared/animations/fade.animation";

@Component({
    selector: 'wfm-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [fadeStateTriggerMessage]
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    message: Message;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {

        this.message = {type: 'danger', text: ''};

        this.route.queryParams.subscribe((params: Params) => {
            if (params.nowCanLogin) {
                this.showMessage({text: 'Теперь вы можете зайти в систему', type: 'success'});
            } else if (params.accessDenied) {
                this.showMessage({text: 'Требуется авторизация!', type: 'warning'});
            }
        });

        this.form = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(6)
            ])
        });

    }

    private showMessage(message: Message) {
        this.message = message;
        window.setTimeout(() => {
            this.message.text = '';
        }, 5000);
    }

    onSubmit() {

        const formData: User = this.form.value;

        this.userService
            .login(formData.email, formData.password)
            .subscribe((response) => {
                if (response.errors) {
                    return this.showMessage({text: response.data.message, type: 'danger'});
                }

                this.message.text = '';

                LocalStorageService.set('user', response.data.user);
                this.authService.user = response.data.user;
                this.authService.login();

                return this.router.navigate(['/system', 'bill']);
            });

    }

}
