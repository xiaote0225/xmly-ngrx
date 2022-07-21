import { contextFeatureKey, ContextState } from './reducer';
import { createFeature, createSelector } from "@ngrx/store";

// const selectContextFeature = createFeature<ContextState>(contextFeatureKey);

const selectContextState = (state:ContextState) => state;

export const getUser = createSelector(selectContextState,(state:ContextState) => state.user);


