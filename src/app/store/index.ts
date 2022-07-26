import { RouterStoreModule } from './router/index';
import { ContextStoreModule } from './context/index';
import { StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";
import { EffectsModule } from '@ngrx/effects';
import { STORE_CONFIG } from './configs';
import { extModules } from 'src/build-specifics';
import { BookStoreModule } from './book';

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forRoot({},STORE_CONFIG),
    EffectsModule.forRoot(),
    ContextStoreModule,
    BookStoreModule,
    RouterStoreModule,
    extModules,
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
