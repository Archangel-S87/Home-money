import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {UserService} from '../../shared/services/user.service';
import {AuthService} from '../../shared/services/auth.service';
import {Message, User} from "../../shared/types";

@Component({
    selector: 'wfm-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
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

                this.authService.user = response.data.user;

                const user = {...response.data.user};

                this.message.text = '';

                // TODO Убрать перед продакшеном?
                //delete user.token;
                window.localStorage.setItem('user', JSON.stringify(this.authService.user));

                this.authService.login();

                // TODO Сделать редирект на предидущую страницу ксли есть
                return this.router.navigate(['/system', 'bill']);
            });

    }

}
