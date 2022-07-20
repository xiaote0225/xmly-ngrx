import { trigger, transition, style, animate } from '@angular/animations';
import { SubCategory } from './../../../services/apis/types';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, PLATFORM_ID, Input, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef, OnDestroy, TemplateRef } from '@angular/core';
import { EasyingFn, ScrollEl, ScrollService } from 'src/app/services/tools/scroll.service';



@Component({
  selector: 'xm-back-top',
  templateUrl: './back-top.component.html',
  styleUrls: ['./back-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('fadeShow',[
      transition(':enter',[
        style({opacity:0}),
        animate('.2s',style({opacity:1}))
      ]),
      transition(':leave',[
        animate('.2s',style({opacity:0}))
      ])
    ])
  ]
})
export class BackTopComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() target!: string | HTMLElement;
  @Input() visibleHeight = 450;
  @Input() tpl!:TemplateRef<any>;
  private scrollTarget!:HTMLElement;
  visible = false;
  scrollHandler!: Subscription;
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private doc:Document,
    private cdr:ChangeDetectorRef,
    private scrollServe:ScrollService
  ) { }



  ngOnChanges(changes: SimpleChanges): void {
    // console.log('---------',changes['target']);
    const {target} = changes;
    if(target){
      this.scrollTarget = typeof target.currentValue === 'string' ? this.doc.querySelector(target.currentValue) : target.currentValue;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.listenScrollEvent();
    }
  }

  clickBackTo():void{
    if(isPlatformBrowser(this.platformId)){
      this.scrollServe.scrollTo(this.getTarget(),0);
    }
  }

  private getTarget():ScrollEl{
    return this.scrollTarget || window;
  }

  private listenScrollEvent():void{
    this.scrollHandler = fromEvent(this.getTarget(),'scroll').pipe(debounceTime(200)).subscribe(
      () => {
        const currentScrollValue = this.scrollServe.getScroll(this.getTarget());
        this.visible = currentScrollValue > this.visibleHeight;
        this.cdr.markForCheck();
      }
    );
  }
  ngOnDestroy(): void {
    if(this.scrollHandler){
      this.scrollHandler.unsubscribe();
    }
  }

}
