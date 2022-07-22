import { ContextStoreModule } from './context/index';
import { StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    ContextStoreModule
  ]
})
export class XmStoreModule{}
