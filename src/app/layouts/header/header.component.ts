import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, ElementRef, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

import { User } from './../../services/apis/types';
import { ContextStoreService } from 'src/app/services/business/context.store.service';
@Component({
  selector: 'xm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('moveUpMotion', [
      state('true', style({
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1
      })),
      transition('* => true',[
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        }),
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  user!: User | null;
  fix = false;
  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private contextStoreService:ContextStoreService
  ) { }

  ngOnInit(): void {
    this.contextStoreService.getUser().subscribe((user: User|null) => {
      this.user = user;
      this.cdr.markForCheck();
    })
  }

  ngAfterViewInit(): void {
    fromEvent(this.doc, 'scroll')
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const top = this.doc.documentElement.scrollTop;
        console.log('----------doc',this.doc);
        console.log('----------clientHeight',this.el.nativeElement);
        if (top > this.el.nativeElement.clientHeight + 100) {
          this.fix = true;
        } else if (top === 0) {
          this.fix = false;
        }
        this.cdr.markForCheck();
      });
  }
}
