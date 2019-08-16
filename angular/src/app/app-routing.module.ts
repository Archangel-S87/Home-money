import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';

import {NotFoundComponent} from "./shared/components/not-faund/not-faund.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', redirectTo: 'login', pathMatch: 'full'},
  {path: 'registration', redirectTo: 'registration', pathMatch: 'full'},
  {path: 'system', loadChildren: './system/system.module#SystemModule'},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
