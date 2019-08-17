import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LoaderComponent} from "./components/loader/loader.component";
import {LocalStorageService} from "./services/localStorage.service";

@NgModule({
  declarations: [LoaderComponent],
  imports: [ReactiveFormsModule, FormsModule],
  exports: [ReactiveFormsModule, FormsModule, LoaderComponent],
  providers: [LocalStorageService]
})
export class SharedModule {}
