import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {UserService} from './shared/services/user.service';
import {AuthService} from './shared/services/auth.service';
import {SystemModule} from './system/system.module';
import {LocalStorageService} from "./shared/services/localStorage.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AuthModule,
    SystemModule
  ],
  providers: [UserService, AuthService, LocalStorageService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
