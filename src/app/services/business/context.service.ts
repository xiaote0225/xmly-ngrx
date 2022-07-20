import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../apis/types';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  private user$ = new Subject<User | null>();
  constructor() { }

  setUser(user:User | null):void{
    this.user$.next(user);
  }

  getUser():Observable<User|null>{
    return this.user$.asObservable();
  }
}
