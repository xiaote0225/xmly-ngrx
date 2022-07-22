import { getUser, selectContextFeature } from './../../store/context/selectors';
import { ContextState } from './../../store/context/reducer';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../apis/types';
import { ContextStoreModule } from 'src/app/store/context';
import { select, Store } from '@ngrx/store';
import { setUser } from 'src/app/store/context/action';

@Injectable({
  providedIn: 'root'
})
export class ContextStoreService {
  readonly context$: Observable<ContextState>;

  constructor(private store$:Store<ContextStoreModule>) {
    this.context$ = this.store$.select(selectContextFeature);
  }

  setUser(user:User | null):void{
    this.store$.dispatch(setUser(user!));
  }

  getUser():Observable<User|null>{
    return this.context$.pipe(select(getUser));
  }
}
