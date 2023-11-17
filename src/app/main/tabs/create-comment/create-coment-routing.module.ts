import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCommentComponent } from './create-comment.component';

const routes: Routes = [
  {
    path: '',
    component: CreateCommentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCommentRoutingModule {}
