import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumsModule } from './albums/albums.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlbumsModule
  ],
  exports:[
    AlbumsModule
  ]
})
export class PagesModule { }
