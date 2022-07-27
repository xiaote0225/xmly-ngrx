import { RouterStoreModule } from './router/index';
import { ContextStoreModule } from './context/index';
import { StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";
import { EffectsModule } from '@ngrx/effects';
import { STORE_CONFIG } from './configs';
import { extModules } from 'src/build-specifics';
import { BookStoreModule } from './book';
import * as fromMobile from './mobile';
import { CategoryEffects } from './category/category.effects';

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forRoot({},STORE_CONFIG),
    EffectsModule.forRoot(),
    ContextStoreModule,
    BookStoreModule,
    RouterStoreModule,
    extModules,
    StoreModule.forFeature(fromMobile.mobileFeatureKey, fromMobile.reducers, { metaReducers: fromMobile.metaReducers }),
    EffectsModule.forFeature([CategoryEffects]),
  ],
  // providers:[
  //   {
  //     provide:META_REDUCERS,
  //     useFactory:metaReducerFactory,
  //     multi: true
  //   }
  // ]
})
export class XmStoreModule{}
