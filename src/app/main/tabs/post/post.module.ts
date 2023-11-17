import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PostComponent } from './post.component';
import { PostRoutingModule } from './post-routing.module';
//import { ActionSheetController } from '@ionic/angular';

@NgModule({
  declarations: [PostComponent],
  imports: [CommonModule, IonicModule, FormsModule, PostRoutingModule],
})
export class PostModule {}
