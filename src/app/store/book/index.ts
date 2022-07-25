import { BookFeatureKey, bookReducer } from './reducer';
import { StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forFeature(BookFeatureKey,bookReducer)
  ]
})
export class BookStoreModule{}
