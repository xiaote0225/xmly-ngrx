import { ContextStoreModule } from './context/index';
import { META_REDUCERS, StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";
import { EffectsModule } from '@ngrx/effects';
import { metaReducerFactory, metaReducers } from './configs';

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    ContextStoreModule
  ],
  providers:[
    {
      provide:META_REDUCERS,
      useFactory:metaReducerFactory,
      multi: true
    }
  ]
})
export class XmStoreModule{}
