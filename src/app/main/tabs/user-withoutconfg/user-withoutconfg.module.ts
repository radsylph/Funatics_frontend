import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserWithoutconfgPageRoutingModule } from './user-withoutconfg-routing.module';

import { UserWithoutconfgPage } from './user-withoutconfg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserWithoutconfgPageRoutingModule
  ],
  declarations: [UserWithoutconfgPage]
})
export class UserWithoutconfgPageModule {}
