import { createAction,props } from "@ngrx/store";
import { AlbumArgs, CategoryInfo } from "src/app/services/apis/album.service";
import { Category } from "src/app/services/apis/types";

export const categoriesInit = createAction('[Category] Categories init');
export const categoryInfoInit = createAction('[Category] Info init', props<AlbumArgs>());
export const categoryEffectInit = createAction('[Category] Effect init');

export const setCategories = createAction(
  '[Category] Set Categories',
  props<{ categories: Category[]; }>()
);

export const setCategoryInfo = createAction(
  '[Category] Set CategoryInfo',
  props<CategoryInfo>()
);

export const setCategory = createAction(
  '[Category] Set Category',
  props<{ category: string; }>()
);

export const setSubCategory = createAction(
  '[Category] Set SubCategory',
  props<{ category: string[]; }>()
);
