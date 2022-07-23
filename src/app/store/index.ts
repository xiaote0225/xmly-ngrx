import { ContextStoreModule } from './context/index';
import { StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";
import { EffectsModule } from '@ngrx/effects';
import { metaReducers } from './configs';

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forRoot({},{metaReducers}),
    EffectsModule.forRoot(),
    ContextStoreModule
  ]
})
export class XmStoreModule{}
