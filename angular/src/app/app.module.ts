import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {NotFoundComponent} from "./shared/components/not-faund/not-faund.component";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {AuthService} from './shared/services/auth.service';
import {AuthGuard} from "./shared/services/auth.guard";
import {UserService} from './shared/services/user.service';
import {LocalStorageService} from "./shared/services/localStorage.service";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [AuthService, AuthGuard, UserService, LocalStorageService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
