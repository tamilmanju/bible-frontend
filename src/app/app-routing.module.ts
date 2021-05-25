import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'search/:search_word/:search_version',
    loadChildren: () =>
      import('./modules/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./modules/search/search.module').then(m => m.SearchModule)
  }
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
