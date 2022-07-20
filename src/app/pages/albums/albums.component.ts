import { PlayerService } from './../../services/business/player.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, withLatestFrom } from 'rxjs';

import { CategoryService } from './../../services/business/category.service';
import { MetaValue, SubCategory, MetaData, Album, AlbumInfo } from './../../services/apis/types';
import { AlbumArgs, AlbumService, AlbumsInfo, CategoryInfo } from 'src/app/services/apis/album.service';
import { WindowService } from 'src/app/services/tools/window.service';
import { storageKeys } from 'src/app/configs';
import { PageService } from 'src/app/services/tools/page.service';

interface CheckedMeta {
  metaRowId: number;
  metaRowName: string;
  metaId: number;
  metaName: string;
}

@Component({
  selector: 'xm-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {

  sorts = ['综合排序', '最近更新', '播放最多'];
  searchParams: AlbumArgs = {
    category: '',
    subcategory: '',
    meta: '',
    sort: 0,
    page: 1,
    perPage: 30
  };
  total = 0;
  categoryInfo!: CategoryInfo;
  checkedMetas: CheckedMeta[] = [];
  albumsInfo!: AlbumsInfo;
  // currentIcon :IconType = 'headset';
  constructor(
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private winService:WindowService,
    private playerServe:PlayerService,
    private pageServe: PageService
  ) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe(paramMap => {
    //   const pinyin = paramMap.get('pinyin');
    //   console.log('pinyin params:', pinyin);
    //   this.searchParams.category = pinyin!;
    //   this.updatePageData();
    // });

    this.route.paramMap.pipe(
      withLatestFrom(this.categoryService.getCategory())
    ).subscribe(([paramMap, category]) => {
      const pinyin = paramMap.get('pinyin');
      this.searchParams.category = pinyin!;
      let needSetStatus = false;
      if (pinyin !== category) {
        this.categoryService.setCategory(pinyin!);
        // this.searchParams.subcategory = '';
        // this.winService.removeStorage(storageKeys.subcategoryCode);
        // this.categoryService.setSubCategory([]);
        this.clearSubCategory();
        this.unCheckMeta('clear');
      }else{
        const cacheSubCategory = this.winService.getStorage(storageKeys.subcategoryCode);
        const cacheMetas = this.winService.getStorage(storageKeys.metas);
        if(cacheSubCategory){
          needSetStatus = true;
          this.searchParams.subcategory = cacheSubCategory;
        }else{
          this.clearSubCategory();
        }
        if(cacheMetas){
          needSetStatus = true;
          this.searchParams.meta = cacheMetas;
        }
      }
      this.updatePageData(needSetStatus);
    });
    this.pageServe.setPageInfo(
      '专辑列表',
      'angular10仿喜马拉雅',
      '小说,音乐,教育...'
    )
  }

  playAlbum(event:MouseEvent,albumId:number):void{
    event.stopPropagation();
    this.albumService.album(albumId.toString()).subscribe(({mainInfo,tracksInfo}) => {
      this.playerServe.setTracks(tracksInfo.tracks);
      this.playerServe.setCurrentIndex(0);
      this.playerServe.setAlbum({...mainInfo,albumId});
    });
    // console.log('playAlbum',album);
    // console.log(this.tracks);
    // this.playerServe.setTracks(this.tracks);
    // this.playerServe.setCurrentIndex(0);
    // this.playerServe.setAlbum(this.albumInfo);
  }

  changeSubCategory(subCategory?: SubCategory): void {
    if(subCategory){
      this.searchParams.subcategory = subCategory.code;
      this.categoryService.setSubCategory([subCategory.displayValue]);
      this.winService.setStorage(storageKeys.subcategoryCode,this.searchParams.subcategory);
    }else{
      this.clearSubCategory();
    }
    this.unCheckMeta('clear');
    this.updatePageData();
  }

  changeMeta(row: MetaData, meta: MetaValue): void {
    this.checkedMetas.push({
      metaRowId: row.id,
      metaRowName: row.name,
      metaId: meta.id,
      metaName: meta.displayName
    });
    this.searchParams.meta = this.getMetaParams();
    console.log('checkedMetas', this.checkedMetas);
    this.winService.setStorage(storageKeys.metas,this.searchParams.meta);
    this.updateAlbums();
  }

  unCheckMeta(meta: CheckedMeta | 'clear'): void {
    if (meta === 'clear') {
      this.checkedMetas = [];
      this.searchParams.meta = this.getMetaParams();
      this.winService.removeStorage(storageKeys.metas);
    } else {
      const targetIndex = this.checkedMetas.findIndex(item => {
        return (item.metaRowId === meta.metaRowId) && (item.metaId === meta.metaId)
      });
      if (targetIndex > -1) {
        this.checkedMetas.splice(targetIndex, 1);
        this.searchParams.meta = this.getMetaParams();
        this.winService.setStorage(storageKeys.metas,this.searchParams.meta);
      }
    }
    this.updateAlbums();
  }

  changePage(newPageNum:number):void{
    if(this.searchParams.page !== newPageNum){
      this.searchParams.page = newPageNum;
      this.updateAlbums();
    }
  }

  private getMetaParams(): string {
    let result = '';
    if (this.checkedMetas.length) {
      this.checkedMetas.forEach(item => {
        result += item.metaRowId + '_' + item.metaId + '-';
      });
    }
    console.log('meta params', result.slice(0, -1));
    return result.slice(0, -1);
  }

  showMetaRow(name: string): boolean {
    if (this.checkedMetas.length) {
      return this.checkedMetas.findIndex(item => item.metaRowName === name) === -1;
    }
    return true;
  }

  private updatePageData(needSetStatus = false): void {

    forkJoin([
      this.albumService.albums(this.searchParams),
      this.albumService.detailCategoryPageInfo(this.searchParams)
    ]).subscribe(([albumsInfo, categoryInfo]) => {
      this.categoryInfo = categoryInfo;
      console.log('albumsInfo', albumsInfo);
      this.total = albumsInfo.total;
      this.albumsInfo = albumsInfo;
      if(needSetStatus){
        this.setStatus(categoryInfo);
      }
      this.cdr.markForCheck();
    });

    // this.albumService.albums(this.searchParams).subscribe(res => {
    //   console.log('AlbumInfo',res);
    // });
    // this.albumService.detailCategoryPageInfo(this.searchParams).subscribe(categoryInfo => {
    //   this.categoryInfo = categoryInfo;
    //   this.cdr.markForCheck();
    // });
  }

  private clearSubCategory():void{
    this.searchParams.subcategory = '';
    this.categoryService.setSubCategory([]);
    this.winService.removeStorage(storageKeys.subcategoryCode);
  }

  private setStatus({metadata,subcategories}:CategoryInfo):void{
    const subCategory = subcategories.find(item => item.code === this.searchParams.subcategory);
    if(subCategory){
      this.categoryService.setSubCategory([subCategory.displayValue]);
    }
    console.log('metadata',metadata);
    // console.log('setStatus--------',categoryInfo);
    if(this.searchParams.meta){
      const metasMap = this.searchParams.meta.split('-').map(item => item.split('_'));
      console.log('metasMap',metasMap);
      metasMap.forEach(meta => {
        const targetRow = metadata.find(row => row.id === Number(meta[0]));
        const {id:metaRowId,name,metaValues} = targetRow || metadata[0];
        const targetMeta = metaValues.find(item => item.id === Number(meta[1]));
        const {id,displayName} = targetMeta || metaValues[0];
        this.checkedMetas.push({
          metaRowId,
          metaRowName:name,
          metaId:id,
          metaName:displayName
        });
      });
    }
  }

  trackBySubCategories(index: number, item: SubCategory): string { return item.code; }
  trackByMetas(index: number, item: MetaValue): number { return item.id; }
  trackByAlbums(index:number,item:Album):number {return item.albumId;}

  changeSort(index: number): void {
    if (this.searchParams.sort !== index) {
      this.searchParams.sort = index;
      this.updateAlbums();
    }
  }

  private updateAlbums(): void {
    this.albumService.albums(this.searchParams).subscribe(albumsInfo => {
      this.albumsInfo = albumsInfo;
      this.total = albumsInfo.total;
      this.cdr.markForCheck();
    });
  }
}
