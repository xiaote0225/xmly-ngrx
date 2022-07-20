import { storageKeys } from 'src/app/configs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Base, User } from './types';

export interface LoginType{
  user:User;
  token:string;
}

const headers = new HttpHeaders().set(storageKeys.needToken,'true');
@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly prefix = '/xmly/';

  constructor(private http:HttpClient) {

  }

  login(params:Exclude<User,'name'>):Observable<LoginType>{
    return this.http.post<Base<LoginType>>(`${environment.baseUrl}${this.prefix}login`,params)
    .pipe(map((res:Base<LoginType>) => res.data))
  }

  userInfo():Observable<LoginType>{
    return this.http.get<Base<LoginType>>(`${environment.baseUrl}${this.prefix}account`,{
      headers: headers
    }).pipe(
      map((res:Base<LoginType>) => res.data)
    )
  }


  logout():Observable<void>{
    return this.http.get<Base<void>>(`${environment.baseUrl}${this.prefix}logout`,{
      headers: headers
    }).pipe(
      map((res:Base<void>) => res.data)
    )
  }


}
