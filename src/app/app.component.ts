import { trigger, transition, style, animate } from '@angular/animations';
import { combineLatest, empty, merge, of, pluck, Subscription, switchMap } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlbumService } from './services/apis/album.service';
import { Category, Track, AlbumInfo } from './services/apis/types';
import { CategoryService } from './services/business/category.service';
import { OverlayService, OverlayRef } from './services/tools/overlay.service';
import { WindowService } from './services/tools/window.service';
import { UserService } from './services/apis/user.service';
import { ContextService } from './services/business/context.service';
import { storageKeys } from './configs';
import { MessageService } from './share/components/message/message.service';
import { XmMessgeType } from './share/components/message/types';
import { PlayerService } from './services/business/player.service';

@Component({
  selector: 'xm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('fadePlayer',[
      transition(':enter',[
        style({opacity:0}),
        animate('.2s',style({opacity:1}))
      ]),
      transition(':leave',[
        style({opacity:0}),
        animate('.2s',style({opacity:0}))
     ])
    ])
  ]
})
export class AppComponent implements OnInit {
  currentCategory!: Category;
  categories: Category[] = [];
  categoryPinyin: string = '';
  subcategory: string[] = [];
  showPlayer = false;
  playerInfo:{
    trackList:Track[];
    currentIndex:number;
    currentTrack:Track;
    album:AlbumInfo;
    playing:boolean;
  } = null!;
  changeCategory(category: Category): void {
    // if (this.currentCategory.id !== category.id) {
      // this.currentCategory = category;
      // this.categoryService.setCategory(category.pinyin);
      this.router.navigateByUrl('/albums/' + category.pinyin);
    // }
  }

  // private overlayRef!:OverlayRef | null;
  // private overlaySub!:Subscription | null;

  showLogin = false;
  constructor(private albumServe: AlbumService, private cdr: ChangeDetectorRef, private categoryService: CategoryService,private router: Router,private winServe:WindowService,private userServe:UserService,private contextService:ContextService,private messageService:MessageService,private playerServe: PlayerService) {
    // this.albumServe.categories().subscribe(res => {
    //   // console.log(res);
    // })
  }

  // showOverlay(){
  //   this.overlayRef = this.overlayService.create({fade:true,responseEvent:false,backgroundColor:'rgba(0, 0, 0, .32)'})!;
  //   console.log('overlayRef-------------------------',this.overlayRef);
  //   this.overlaySub = merge(
  //     this.overlayRef.backdropClick(),
  //     this.overlayRef.backdropKeyup().pipe(
  //       pluck('key'),
  //       switchMap(key => {
  //         return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
  //       })
  //     )
  //   ).subscribe(() => {
  //     console.log('listen events');
  //     this.hideOverlay();
  //   });
  // }

  // hideOverlay():void{
  //   if(this.overlaySub){
  //     this.overlaySub.unsubscribe();
  //     this.overlaySub = null;
  //   }
  //   this.overlayRef?.dispose();
  //   this.overlayRef = null;
  // }


  ngOnInit(): void {
    if(this.winServe.getStorage(storageKeys.remember)){
      this.userServe.userInfo().subscribe(({user,token}) => {
        this.contextService.setUser(user);
        // console.log(res);
        this.winServe.setStorage(storageKeys.auth,token);
      },error => {
        console.error('error---------',error);
        this.clearStorage();
      });
    }
    this.init();
    this.watchPlayer();
  }

  private watchPlayer():void{
    combineLatest([
      this.playerServe.getTracks(),
      this.playerServe.getCurrentIndex(),
      this.playerServe.getCurrentTrack(),
      this.playerServe.getAlbum(),
      this.playerServe.getPlaying()
    ]).subscribe(([trackList,currentIndex,currentTrack,album,playing]) => {
      // console.log('trackList',trackList);
      this.playerInfo = {
        trackList,
        currentIndex,
        currentTrack,
        album,
        playing
      }
      if(trackList.length){
        this.showPlayer = true;
        this.cdr.markForCheck();
      }
    });
  }

  private init(): void {

    combineLatest([
      this.categoryService.getCategory(),
      this.categoryService.getSubCategory()
    ]).subscribe(([category, subcategory]) => {
      if (category !== this.categoryPinyin) {
        this.categoryPinyin = category;
        if (this.categories.length) {
          this.setCurrentCategory();
        }
      }
      this.subcategory = subcategory;
    });

    this.getCategories();
  }

  private getCategories(): void {
    this.albumServe.categories().subscribe(categories => {
      this.categories = categories;
      this.setCurrentCategory();
      this.cdr.markForCheck();
    })
  }

  private setCurrentCategory(): void {
    this.currentCategory = this.categories.find(item => item.pinyin === this.categoryPinyin)!;
  }

  logout():void{
    this.userServe.logout().subscribe(() => {
      this.contextService.setUser(null);
      this.clearStorage();
      // alert('退出成功');
      this.messageService.success('退出成功');
    });
  }

  private clearStorage():void{
    this.winServe.removeStorage(storageKeys.remember);
    this.winServe.removeStorage(storageKeys.auth);
  }

  closePlayer():void{
    this.playerServe.clear();
    this.showPlayer = false;
  }

}
