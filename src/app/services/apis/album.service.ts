import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'qs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Album, AlbumInfo, Anchor, Base, Category, MetaData, RelateAlbum, SubCategory, TrackAudio, TracksInfo } from './types';


export interface CategoryInfo {
  category: Category;
  currentSubcategory: SubCategory;
  subcategories: SubCategory[];
  metadata: MetaData[];
}

export interface AlbumsInfo {
  albums: Album[];
  page: number;
  pageSize: number;
  total: number;
  pageConfig: { h1title: string };
}

export interface AlbumArgs {
  category: string;
  subcategory: string;
  meta: string;
  sort: number;
  page: number;
  perPage: number;
}

export interface AlbumRes {
  albumId: number;
  mainInfo: AlbumInfo;
  anchorInfo: Anchor;
  tracksInfo: TracksInfo;
}

export interface AlbumTrackArgs {
  albumId: string;
  sort: number;
  pageNum: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  readonly prefix = '/xmly/';
  constructor(private http: HttpClient) { }

  // 一级分类列表
  categories(categoryId = 3): Observable<Category[]> {
    const params = new HttpParams().set('categoryId', categoryId.toString());
    return this.http
      .get<Base<{ categories: Category[] }>>(`${environment.baseUrl}${this.prefix}breadcrumb`, { params })
      .pipe(map((res: Base<{ categories: Category[] }>) => res.data.categories));
  }


  // 二三级分类列表
  detailCategoryPageInfo(args: Pick<AlbumArgs, 'category' | 'subcategory'>): Observable<CategoryInfo> {
    // const params = new HttpParams({ fromString: stringify(args) });
    return this.http
      .get<Base<CategoryInfo>>(`${environment.baseUrl}${this.prefix}categories`, { params: args })
      .pipe(map((res: Base<CategoryInfo>) => res.data));
  }

  // 专辑列表
  albums(args: AlbumArgs): Observable<AlbumsInfo> {
    const params = new HttpParams({ fromString: stringify(args) });
    return this.http
      .get<Base<AlbumsInfo>>(`${environment.baseUrl}${this.prefix}albums`, { params })
      .pipe(map((res: Base<AlbumsInfo>) => res.data));

  }

  // 专辑详情
  album(albumId: string): Observable<AlbumRes> {
    const params = new HttpParams().set('albumId', albumId);
    return this.http.get<Base<AlbumRes>>(`${environment.baseUrl}${this.prefix}album`, { params })
      .pipe(map((res: Base<AlbumRes>) => res.data));
  }

  // 评分
  albumScore(albumId: string): Observable<number> {
    return this.http.get<Base<{ albumScore: number }>>(`${environment.baseUrl}${this.prefix}album-score/${albumId}`)
      .pipe(map((res: Base<{ albumScore: number }>) => res.data.albumScore || 0));
  }

  // 相关专辑列表
  relateAlbums(id: string): Observable<RelateAlbum[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Base<{ hotWordAlbums: RelateAlbum[] }>>(`${environment.baseUrl}${this.prefix}album-relate`, { params })
      .pipe(map((res: Base<{ hotWordAlbums: RelateAlbum[] }>) => res.data.hotWordAlbums));
  }

  // 播单列表
  tracks(args: AlbumTrackArgs): Observable<TracksInfo> {
    const params = new HttpParams({ fromString: stringify(args) });
    return this.http.get<Base<TracksInfo>>(`${environment.baseUrl}${this.prefix}album-tracks`, { params })
      .pipe(map((res: Base<TracksInfo>) => res.data));
  }

  // 播放地址
  trackAudio(id:number):Observable<TrackAudio>{
    return this.http.get<Base<TrackAudio>>(`${environment.baseUrl}${this.prefix}album-track-url/${id}`).pipe(
      map((res:Base<TrackAudio>) => res.data)
    )
  }
}
