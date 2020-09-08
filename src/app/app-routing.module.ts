import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { UserGridComponent } from './user-grid/user-grid.component';

const routes: Routes = [
  { path: '', redirectTo: '/user-grid', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'user-grid', component: UserGridComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
