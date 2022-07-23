import { Action, createReducer, on } from "@ngrx/store";
import { User } from "src/app/services/apis/types";
import { setUser,loginSuccess, logoutSuccess } from "./action";

export const contextFeatureKey = 'context';

export interface ContextState{
  user:User | null;
  token:string;
}

export const initialState: ContextState = {
  user: null,
  token: ''
}

const reducer = createReducer(
  initialState,
  on(setUser,(state,user) => ({...state,user})),
  on(loginSuccess,(state,{user,token}) => ({user,token})),
  on(logoutSuccess,state => ({user:null,token:''}))
);

export function contextReducer(state:ContextState,action:Action):ContextState{
  return reducer(state,action);
}
