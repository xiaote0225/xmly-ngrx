import { createAction, props } from "@ngrx/store";
import { User } from "src/app/services/apis/types";
import { LoginType } from "src/app/services/apis/user.service";

export const login = createAction(
  '[Context] Login',
  props<Exclude<User,'name'>>()
);

export const loginSuccess = createAction(
  '[Context] Login success',
  props<LoginType>()
);

export const logoutSuccess = createAction(
  '[Context] Logout success'
);

export const logout = createAction(
  '[Context] logout'
);

export const setUser = createAction(
  '[Context] Set user',
  props<User>()
);

export const getUserInfo = createAction(
  '[Context] Get user info'
);
