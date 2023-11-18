import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPageRoutingModule } from './reset-routing.module';

import { ResetComponent } from './reset.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ResetPageRoutingModule],
  declarations: [ResetComponent],
})
export class ResetPageModule {}
