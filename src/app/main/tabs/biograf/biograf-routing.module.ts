import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiografPage } from './biograf.page';

const routes: Routes = [
  {
    path: '',
    component: BiografPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiografPageRoutingModule {}
