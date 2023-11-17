import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CreateCommentComponent } from './create-comment.component';
import { CreateCommentRoutingModule } from './create-coment-routing.module';

@NgModule({
  declarations: [CreateCommentComponent],
  imports: [CommonModule, IonicModule, FormsModule, CreateCommentRoutingModule],
})
export class CreateCommentModule {}
