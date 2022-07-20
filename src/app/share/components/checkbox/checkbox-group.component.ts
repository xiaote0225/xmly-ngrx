import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, Input, forwardRef } from '@angular/core';
import { CheckboxComponent } from './checkbox.component';

export type CheckboxValue = number | string;

@Component({
  selector: 'xm-checkbox-group',
  template: `
    <div class="xm-checkbox-group">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .xm-checkbox-group{
        display: inline-block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi:true
    }
  ]
})
export class CheckboxGroupComponent implements OnInit, ControlValueAccessor {
  private checkboxes:CheckboxComponent[] = [];
  private current: CheckboxValue[] = [];
  // @Input()
  // set initCurrent(checks: CheckboxValue[]){
  //   console.log('init',checks);
  //   this.current = checks;
  //   if(checks.length){
  //     setTimeout(() => {
  //       this.updateCheckBox(checks);
  //     }, 0);
  //   }
  // }
  constructor() { }

  ngOnInit(): void {
  }

  addCheckBox(checkbox:CheckboxComponent):void{
    this.checkboxes.push(checkbox);
    console.log('checkboxes',this.checkboxes);
  }

  updateCheckBox(current:CheckboxValue[]):void{
    if(this.checkboxes.length){
      this.checkboxes.forEach(item => {
        item.writeValue(current.includes(item.value));
      })
    }
    this.current = current;
    this.onChange(this.current);
  }

  handleCheckboxClick(value:CheckboxValue,check:boolean):void{
    console.log('value',value);
    console.log('check',check);
    const newCurrent = this.current.slice();
    if(check){
      if(!newCurrent.includes(value)){
        newCurrent.push(value);
      }
    }else{
      const targetIndex = newCurrent.findIndex(item => item === value);
      if(targetIndex > -1){
        newCurrent.splice(targetIndex,1);
      }
    }
    this.writeValue(newCurrent);
  }

  private onChange = (value:CheckboxValue[]) => {};
  private onTouched = () => {};
  writeValue(value: CheckboxValue[]): void {
    // this.current = value;
    if(value){
      this.updateCheckBox(value);
    }
  }
  registerOnChange(fn: (value:CheckboxValue[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
