import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'album/:albumId',
    loadChildren: () => import('./pages/album/album.module').then(m => m.AlbumModule),
    data: { title: '专辑详情' }
  },
  {
    path:'book',
    loadChildren: () => import('./pages/book/book.module').then(m => m.BookModule),
    data:{ title: "图书"}
  },
  {
    path:'movie',
    loadChildren: () => import('./pages/movie/movie.module').then(m => m.MovieModule),
    data:{ title: "电影"}
  },
  { path: '', redirectTo: '/albums/youshengshu', pathMatch: 'full' },
  { path: '**', redirectTo: '/albums/youshengshu' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration:'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
