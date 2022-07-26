import { createFeatureSelector } from '@ngrx/store';
import { getSelectors, RouterReducerState } from "@ngrx/router-store";

export interface State{
  router: RouterReducerState<any>;
}

export const selectRouter = createFeatureSelector<State,RouterReducerState<any>>('router');

export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl
} = getSelectors(selectRouter);
