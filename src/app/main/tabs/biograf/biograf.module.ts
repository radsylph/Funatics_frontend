import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiografPageRoutingModule } from './biograf-routing.module';

import { BiografPage } from './biograf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiografPageRoutingModule
  ],
  declarations: [BiografPage]
})
export class BiografPageModule {}
