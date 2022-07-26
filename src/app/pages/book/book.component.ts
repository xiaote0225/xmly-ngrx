import { addBook,updateBook,deleteBook,clear,setSelectedBookId } from './../../store/book/actions';
import { selectAllBook } from './../../store/book/selectors';
import { BookStoreModule } from './../../store/book/index';
import { select, Store } from '@ngrx/store';
import { Book } from './../../store/book/reducer';
import { Observable } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { selectBookFeature } from 'src/app/store/book/selectors';

@Component({
  selector: 'xm-book',
  template: `
      <div class="books">
        <button xmBtn xmRipples (click)="addOneBook()">add a book</button> |
        <button xmBtn xmRipples (click)="updateOneBook()">update a book</button> |
        <button xmBtn xmRipples (click)="deleteOneBook()">delete a book</button> |
        <button xmBtn xmRipples (click)="clear()">clear all book</button> |
        <button xmBtn xmRipples (click)="select()">select a book</button> |
        <button xmBtn xmRipples (click)="select2()">select a book2</button>
        <ul>
          <!-- <li *ngFor="let book of books$ | async">{{ book.title }}</li> -->
          <li *ngFor="let book of books$ | ngrxPush">{{ book.title }}</li>
        </ul>
        <p>
          当前选中的book：
          <!-- {{ (selectedBook$ | async)?.title }} -->
        </p>
      </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent implements OnInit {
  flag = 0;
  books$!:Observable<Book[]>;
  selectedBook$!:Observable<Book | undefined>;
  constructor(readonly store$:Store<BookStoreModule>) { }

  ngOnInit(): void {
    const selectBookStore = this.store$.select(selectBookFeature);
    this.books$ = selectBookStore.pipe(select(selectAllBook));
    // this.selectedBook$ = selectBookStore.pipe(select(selectedBook));
  }

  addOneBook():void{
    const result = this.flag++;
    this.store$.dispatch(addBook(this.generateNewBook(result)));
  }

  updateOneBook():void{
    this.store$.dispatch(updateBook({
      id: 'id_1',
      changes:{
        title: '西游记改'
      }
    }));
  }

  deleteOneBook():void{
    this.store$.dispatch(deleteBook({id:'id_1'}));
  }

  clear():void{
    this.store$.dispatch(clear());
  }

  select(): void {
    this.store$.dispatch(setSelectedBookId({ id: 'id_1' }));
  }

  select2(): void {
    this.store$.dispatch(setSelectedBookId({ id: 'id_3' }));
  }

  generateNewBook(flag:number):Book{
    return {
      id: 'id_' + flag,
      title: '西游记' + flag,
      author: 'zgcf' + flag,
      version: 'v' + flag
    }
  }

}
