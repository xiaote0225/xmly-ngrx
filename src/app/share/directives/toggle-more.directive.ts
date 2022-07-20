import { Directive, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[xmToggleMore]'
})
export class ToggleMoreDirective implements OnChanges {
  @Input() content!: string;
  @Input() isFull = false;
  @Input('xmToggleMore') maxHeight: number = 0;
  @Output() initTrueHeight = new EventEmitter<number>();
  private trueHeight = this.maxHeight;
  constructor(private el: ElementRef, private rd2: Renderer2) {
    console.log('================xmToggleMore');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    const { content, isFull } = changes;
    if (content?.currentValue) {
      // setTimeout(() => {
      //   const rect = this.el.nativeElement.getBoundingClientRect();
      //   console.log('----rect',rect)  // 1199.5999755859375
      // },2000);
      timer(100).subscribe(() => {
        this.trueHeight = this.hiddenDomRect(this.el.nativeElement).height;
        console.log('trueHeight', this.trueHeight);
        this.initTrueHeight.emit(this.trueHeight);
      });
    }
    if (isFull) {
      const maxHeight = isFull.currentValue ? this.trueHeight : this.maxHeight;
      this.rd2.setStyle(this.el.nativeElement, 'maxHeight', maxHeight + 'px');
    }
  }

  // 获取隐藏元素尺寸
  private hiddenDomRect(dom: HTMLElement): DOMRect {
    const cloneNode = dom.cloneNode(true) as HTMLElement;
    this.rd2.setStyle(cloneNode, 'position', 'absolute');
    this.rd2.setStyle(cloneNode, 'visibility', 'hidden');
    this.rd2.setStyle(cloneNode, 'pointerEvents', 'none');
    this.rd2.setStyle(cloneNode, 'maxHeight', 'unset');
    this.rd2.appendChild(dom.parentNode, cloneNode);
    const rect = cloneNode.getBoundingClientRect();
    console.log('cloneNode', rect);
    // this.rd2.
    // cloneNode.remove();
    this.rd2.removeChild(dom.parentNode, cloneNode);
    return rect;
  }

}
