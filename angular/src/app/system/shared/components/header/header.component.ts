import { Component, OnInit } from '@angular/core';

import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {User} from "../../../../shared/types";
import {LocalStorageService} from "../../../../shared/services/localStorage.service";

@Component({
  selector: 'wfm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  date: Date = new Date();
  user: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = LocalStorageService.get('user');
  }

  onLogout() {
    this.authService.logout();
    return this.router.navigate(['/login']);
  }

}
