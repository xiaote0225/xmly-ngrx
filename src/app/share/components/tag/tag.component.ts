import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectorRef, Renderer2, ElementRef, HostBinding, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

const ColorPresets = ['megenta','orange','green'];
type TagMode = 'default' | 'circle';

@Component({
  selector: 'xm-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None
})
export class TagComponent implements OnInit,AfterViewInit,OnChanges {

  @Input() xmColor = '';
  @Input() xmShape: TagMode = 'default';
  @Input() xmClosable = false;
  @Output() closed = new EventEmitter<void>();

  private currentColorCls = '';

  constructor(private el:ElementRef,private rd2:Renderer2,private cdr: ChangeDetectorRef) { }


  @HostBinding('class.xm-tag') commonCls = true;
  @HostBinding('class.xm-tag-close') get closeCls():boolean {return this.xmClosable;}
  @HostBinding('class.xm-tag-circle') get circleCls():boolean {return this.xmShape === 'circle';}

  private setStyle():void{
    const tagWrap = this.el.nativeElement;
    if(!tagWrap || !this.xmColor){return;}
    if(ColorPresets.includes(this.xmColor)){
      if(this.currentColorCls){
        this.rd2.removeClass(tagWrap,this.currentColorCls);
        this.currentColorCls = '';
      }
      this.currentColorCls = 'xm-tag-' + this.xmColor;
      this.rd2.addClass(tagWrap,this.currentColorCls);
      this.rd2.removeStyle(tagWrap,'color');
      this.rd2.removeStyle(tagWrap,'background-color');
      this.rd2.removeStyle(tagWrap,'border-color');
    }else{
      this.rd2.setStyle(tagWrap,'color','#fff');
      this.rd2.setStyle(tagWrap,'background-color',this.xmColor);
      this.rd2.setStyle(tagWrap,'border-color','transparent');
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['xmColor']){
      this.setStyle();
    }
  }
  ngAfterViewInit(): void {
    this.setStyle();
  }

}
