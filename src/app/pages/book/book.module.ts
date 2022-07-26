import { DirectivesModule } from 'src/app/share/directives/directives.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { ReactiveComponentModule } from '@ngrx/component';


@NgModule({
  declarations: [
    BookComponent
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    DirectivesModule,
    ReactiveComponentModule
  ]
})
export class BookModule { }
