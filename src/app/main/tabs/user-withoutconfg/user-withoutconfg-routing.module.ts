import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserWithoutconfgPage } from './user-withoutconfg.page';

const routes: Routes = [
  {
    path: '',
    component: UserWithoutconfgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserWithoutconfgPageRoutingModule {}
