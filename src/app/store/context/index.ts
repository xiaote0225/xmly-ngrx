import { EffectsModule } from '@ngrx/effects';
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";

import {contextFeatureKey, contextReducer} from './reducer';
import { UserEffects } from './user.effects.';

@NgModule({
  declarations:[],
  imports:[
    StoreModule.forFeature(contextFeatureKey,contextReducer),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class ContextStoreModule{}
