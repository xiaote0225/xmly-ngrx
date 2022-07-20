import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'xm-sizer',
  templateUrl: './sizer.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SizerComponent),
      multi:true
    }
  ]
})
export class SizerComponent implements OnInit, ControlValueAccessor{
  // @Input() ngModel = 16;
  // @Output() ngModelChange = new EventEmitter<number>();
  size = 16;
  disabled = false;
  constructor(private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  add():void{
    this.size += 1;
    this.onChange(this.size);
    // this.ngModelChange.emit(this.ngModel+1);
  }

  desc():void{
    this.size -= 1;
    this.onChange(this.size);
    // this.ngModelChange.emit(this.ngModel-1);
  }

  private onChange = (value:number) => {};
  private onTouched = () => {};

  writeValue(value: number): void {
    this.size = value;
    this.cdr.markForCheck();
    console.log('====================writeValue',value);
  }
  registerOnChange(fn: (value:number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // 相当于组件或者宿主绑定了disabled属性，就会触发这个函数
  setDisabledState(disabled:boolean):void{
    this.disabled = disabled;
    console.log('setDisabledState=========',disabled);
  }
}
