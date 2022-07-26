import { StoreModule } from '@ngrx/store';
import { NgModule } from "@angular/core";
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';

import {CustomRouterFeatureKey, customRouterReducer} from './custom.reducer';
import { CustomSerializer } from './custom-route-serializer';

@NgModule({
  imports:[
    StoreModule.forFeature(CustomRouterFeatureKey,customRouterReducer),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation
    })
  ]
})
export class RouterStoreModule{}
