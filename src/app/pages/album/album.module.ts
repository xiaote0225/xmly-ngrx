import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumComponent } from './album.component';
import { DirectivesModule } from 'src/app/share/directives/directives.module';
import { TagModule } from 'src/app/share/components/tag/tag.module';
import { PipesModule } from 'src/app/share/pipes/pipes.module';
import { SizerComponent } from './sizer/sizer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'src/app/share/components/checkbox/checkbox.module';
import { PaginationModule } from 'src/app/share/components/pagination/pagination.module';
import { RateModule } from 'src/app/share/components/rate/rate.module';


@NgModule({
  declarations: [
    AlbumComponent,
    SizerComponent
  ],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    DirectivesModule,
    TagModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    CheckboxModule,
    PaginationModule,
    RateModule
  ]
})
export class AlbumModule { }
