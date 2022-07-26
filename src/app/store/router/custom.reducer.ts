import { getSelectors } from '@ngrx/router-store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { RouterStateUrl } from './custom-route-serializer';
export const CustomRouterFeatureKey = 'customRouter';

export interface CustomRouterState{
  [CustomRouterFeatureKey]: RouterReducerState<RouterStateUrl>;
}

export const customRouterReducer:ActionReducerMap<CustomRouterState> = {
  [CustomRouterFeatureKey]: routerReducer
}

export const selectCustomRouter = createFeatureSelector<CustomRouterState,RouterReducerState<RouterStateUrl>>(CustomRouterFeatureKey);

export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl
} = getSelectors(selectCustomRouter);
