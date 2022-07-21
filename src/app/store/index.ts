import { ContextStoreModule } from './context/index';
import { StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forRoot({}),
    ContextStoreModule
  ]
})
export class XmStoreModule{}
