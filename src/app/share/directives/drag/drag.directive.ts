import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, Inject, PLATFORM_ID, Renderer2, AfterViewInit, ContentChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { clamp } from 'lodash';
import { DragHandlerDirective } from './drag-handler.directive';

interface StartPosition{
  x: number;
  y: number;
  left?: number;
  top?: number;
}

@Directive({
  selector: '[xmDrag]'
})
export class DragDirective implements AfterViewInit{
  @Input() limitInWindow = false;
  private startPosition!: StartPosition;
  private hostEl!: HTMLElement;
  private movable = false;
  private dragMoveHandler!: () => void;
  private dragEndHandler!: () => void;
  @Output() finished = new EventEmitter<HTMLElement>();
  @ContentChildren(DragHandlerDirective,{descendants:true})
  private handlers!: QueryList<DragHandlerDirective>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private doc:Document,
    private el:ElementRef,
    private rd2:Renderer2
  ) {
    console.log('DragDirective---------------');
  }


  ngAfterViewInit(): void {
    this.hostEl = this.el.nativeElement;
    console.log('handlers-------------------',this.handlers);
    this.setHandlerMouseStyle();
  }

  private setHandlerMouseStyle():void{
    if(this.handlers.length){
      this.handlers.forEach(item => this.rd2.setStyle(item.el.nativeElement,'cursor','move'));
    }else{
      this.rd2.setStyle(this.hostEl,'cursor','move');
    }
  }

  @HostListener('mousedown',['$event'])
  dragStart(event:MouseEvent):void{
    console.log('mousedown---------------');
    if(isPlatformBrowser(this.platformId)){
      console.log('event',event);
      const allowDrag = event.button === 0 && (!this.handlers.length || this.handlers.some(item => item.el.nativeElement.contains(event.target)));
      // console.log('allowDrag',allowDrag);
      if(allowDrag){
        event.preventDefault();
        event.stopPropagation();
        const {left , top } = this.hostEl.getBoundingClientRect();
        this.rd2.setStyle(this.hostEl,'transition','none');
        this.startPosition = {
          x: event.clientX,
          y: event.clientY,
          left,
          top
        }
        this.toggleMoving(true);

      }
      // console.log('startPosition',this.startPosition);
      // console.log('rect',this.hostEl.getBoundingClientRect());
      // console.log('offsetLeft',this.hostEl.offsetLeft);
      // console.log('offsetTop',this.hostEl.offsetTop);
    }
  }

  private toggleMoving(movable:boolean):void{
    this.movable = movable;
    if(movable){
      this.dragMoveHandler = this.rd2.listen(this.doc,'mousemove',this.dragMove.bind(this));
      this.dragEndHandler = this.rd2.listen(this.doc,'mouseup',this.dragEnd.bind(this));
    }else{
      if(this.dragMoveHandler){
        this.dragMoveHandler();
      }
      if(this.dragEndHandler){
        this.dragEndHandler()
      }
      this.finished.emit(this.hostEl);
    }
  }

  private dragMove(event:MouseEvent):void{
    event.preventDefault();
    event.stopPropagation();
    const diffX = event.clientX - this.startPosition.x;
    const diffY = event.clientY - this.startPosition.y;
    this.calculate(diffX,diffY);
    const {left ,top } = this.calculate(diffX,diffY);
    this.rd2.setStyle(this.hostEl,'right','unset');
    this.rd2.setStyle(this.hostEl,'left',left + 'px');
    this.rd2.setStyle(this.hostEl,'top',top+'px');
    // console.log('diffX',diffX);
  }

  private calculate(diffX:number,diffY:number):{left:number;top:number}{
    let newLeft = this.startPosition.left! + diffX;
    let newTop = this.startPosition.top! + diffY;
    if(this.limitInWindow){
      const {width , height } = this.hostEl.getBoundingClientRect();
      const maxLeft = this.doc.documentElement.clientWidth - width;
      const maxTop = this.doc.documentElement.clientHeight - height;
      newLeft = clamp(newLeft,0,maxLeft);
      newTop = clamp(newTop,0,maxTop);
    }
    return {
      left: newLeft,
      top: newTop
    };
  }

  private dragEnd():void{
    this.toggleMoving(false);
  }


}
