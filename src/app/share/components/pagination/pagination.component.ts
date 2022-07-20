import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { clamp } from 'lodash';

type PageItemType = 'page' | 'prev' | 'next' | 'prev5' | 'next5';

interface PageItem {
  type: PageItemType;
  num?: number;
  disabled?: boolean;
}

@Component({
  selector: 'xm-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit,OnChanges {
  @Input() total = 0;
  @Input() pageNum = 1;
  @Input() pageSize = 10;
  @Output() changed = new EventEmitter<number>();
  lastNum = 0;
  listOfPageItems: PageItem[] = [];
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('-----ngOnChanges',changes);
    this.lastNum = Math.ceil(this.total / this.pageSize) || 1;
    this.listOfPageItems = this.getListOfPageItems(this.pageNum, this.lastNum);
  }

  inputVal(num:number):void{
    if(num > 0){
      this.pageClick({
        type:'page',
        num
      })
    }
  }

  pageClick({type,num,disabled}:PageItem):void{
    if(!disabled){
      let newPageNum = this.pageNum;
      if(type === 'page'){
        newPageNum = num!;
      }else{
        const diff:any = {
          next:1,
          prev:-1,
          prev5:-5,
          next5:5
        };
        newPageNum += diff[type];
      }
      this.changed.emit(clamp(newPageNum,1,this.lastNum));
      console.log('-----------------newPageNum',newPageNum);
    }
  }

  ngOnInit(): void {
  }

  private getListOfPageItems(pageNum: number, lastNum: number): PageItem[] {
    if (lastNum <= 9) {
      return concatWithPrevNext(generatePage(1, lastNum), pageNum, lastNum);
    } else {
      const firstPageItem = generatePage(1, 1);
      const lastPageItem = generatePage(lastNum, lastNum);
      const prevFiveItem:PageItem = { type: 'prev5' };
      const nextFiveItem:PageItem = { type: 'next5' };
      let listOfMidPages:PageItem[] = [];
      if (pageNum < 4) {
        listOfMidPages = [...generatePage(2, 5), nextFiveItem];
      } else if (pageNum > lastNum - 4) {
        listOfMidPages = [prevFiveItem, ...generatePage(lastNum - 4, lastNum - 1)];
      } else {
        listOfMidPages = [prevFiveItem, ...generatePage(pageNum - 2, pageNum + 2), nextFiveItem];
      }
      return concatWithPrevNext([...firstPageItem,...listOfMidPages,...lastPageItem],pageNum,lastNum);
    }
  }

}

function generatePage(start: number, end: number): PageItem[] {
  const list: PageItem[] = [];
  for (let i = start; i <= end; i++) {
    list.push({
      num: i,
      type: 'page'
    });
  }
  return list;
}

function concatWithPrevNext(listOfPage: PageItem[], pageNum: number, lastNum: number): PageItem[] {
  return [
    {
      type: 'prev',
      disabled: pageNum === 1
    },
    ...listOfPage,
    {
      type: 'next',
      disabled: pageNum === lastNum
    }
  ];
}
