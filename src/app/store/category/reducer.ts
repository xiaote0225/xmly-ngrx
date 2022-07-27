import { Action, createReducer,on } from "@ngrx/store";
import { CategoryInfo } from "src/app/services/apis/album.service";
import { Category } from "src/app/services/apis/types";
import {setCategories, setCategory, setCategoryInfo, setSubCategory} from './actions';

export const CategoryFeatureKey = 'category';

export interface CategoryState {
  category: string;
  subcategory: string[];
  categories: Category[];
  categoryInfo: CategoryInfo | null;
}

export const initialState: CategoryState = {
  category: 'youshengshu',
  subcategory: [],
  categories: [],
  categoryInfo: null
};


export const reducer = createReducer(
  initialState,
  on(setCategories, (state, { categories }) => ({ ...state, categories })),
  on(setCategoryInfo, (state, categoryInfo) => ({ ...state, categoryInfo })),
  on(setCategory, (state, { category }) => ({ ...state, category })),
  on(setSubCategory, (state, { category }) => ({ ...state, subcategory: category }))
);

export function categoryReducer(state: CategoryState, action: Action): CategoryState {
  return reducer(state, action);
}
