import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchPageModule),
      },
    ],
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreatePageModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserPageModule),
  },
  {
    path: 'post',
    loadChildren: () => import('./post/post.module').then((m) => m.PostModule),
  },
  {
    path: 'edit',
    loadChildren: () =>
      import('./edit/edit.module').then((m) => m.EditPageModule),
  },
  {
    path: 'create-comment',
    loadChildren: () =>
      import('./create-comment/create-comment.module').then(
        (m) => m.CreateCommentModule
      ),
  },
  {
    path: 'user-withoutbtn',
    loadChildren: () =>
      import('./user-withoutbtn/user-withoutbtn.module').then(
        (m) => m.UserWithoutbtnPageModule
      ),
  },
  {
    path: 'user-withoutconfg',
    loadChildren: () =>
      import('./user-withoutconfg/user-withoutconfg.module').then(
        (m) => m.UserWithoutconfgPageModule
      ),
  },
  {
    path: 'biograf',
    loadChildren: () =>
      import('./biograf/biograf.module').then((m) => m.BiografPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
