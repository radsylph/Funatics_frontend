import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserWithoutbtnPageRoutingModule } from './user-withoutbtn-routing.module';

import { UserWithoutbtnPage } from './user-withoutbtn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserWithoutbtnPageRoutingModule
  ],
  declarations: [UserWithoutbtnPage]
})
export class UserWithoutbtnPageModule {}
