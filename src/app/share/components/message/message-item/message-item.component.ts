import { trigger, transition, style, animate,AnimationEvent } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MessageComponent } from '../message.component';
import { XmMessageItemData } from '../types';

@Component({
  selector: 'xm-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('moveUpMotion',[
      transition('x => enter',[
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate('.2s',style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition('x => leave',[
        animate('3s',style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ])
    ])
  ]
})
export class MessageItemComponent implements OnInit,OnDestroy {
  @Input() index = 0;
  @Input() message!: XmMessageItemData;
  private timerSub!:Subscription;
  private autoClose = true;
  constructor(
    private parent:MessageComponent,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    const { duration } = this.message.options!;
    this.autoClose = duration! > 0;
    if(this.autoClose){
      this.createTimer(duration!);
    }
  }

  private createTimer(duration:number):void{
    this.timerSub = timer(duration).subscribe(() => {
      this.close();
    });
  }

  close():void{
    this.message.state = 'leave';
    this.cdr.markForCheck();
    // this.parent.removeMessage(this.message.messageId)
  }

  get itemCls():string{
    return 'xm-message clearfix ' + this.message.options?.type;
  }

  enter():void{
    if(this.autoClose && this.message.options?.pauseOnHover){
      this.clearTimer();
    }
  }

  leave():void{
    if(this.autoClose && this.message.options?.pauseOnHover){
      this.createTimer(this.message.options?.duration!);
    }
  }

  private clearTimer():void{
    if(this.timerSub){
      this.timerSub.unsubscribe();
      this.timerSub = null!;
    }
  }

  animationDone(event:AnimationEvent):void{
    if(event.toState === 'leave'){
      this.parent.removeMessage(this.message.messageId);
    }
    console.log('animationDone',event);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

}
