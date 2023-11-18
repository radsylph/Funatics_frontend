import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserWithoutbtnPage } from './user-withoutbtn.page';

const routes: Routes = [
  {
    path: '',
    component: UserWithoutbtnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserWithoutbtnPageRoutingModule {}
