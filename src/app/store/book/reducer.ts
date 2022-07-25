import { addBook, updateBook,deleteBook,clear, setSelectedBookId } from './actions';
import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

export const BookFeatureKey = 'Book';

export interface Book{
  id:string;
  title:string;
  author:string;
  version: string;
}

export interface BookState extends EntityState<Book>{
  selectedBookId:string;
}

export const adapter: EntityAdapter<Book> = createEntityAdapter<Book>({
  // 指定主键,默认是id,可以省略
  // selectId: (b:Book) => b.id
});

export const initialState: BookState = adapter.getInitialState({
  // additional entity state properties
  selectedBookId: ''
});

const reducer = createReducer(
  initialState,
  on(addBook,(state,book) => adapter.addOne(book,state)),
  on(updateBook,(state,book) => adapter.updateOne(book,state)),
  on(deleteBook,(state,{id}) => adapter.removeOne(id,state)),
  on(clear,(state) => adapter.removeAll({...state,selectedBookId:''})),
  on(setSelectedBookId,(state,{id}) => ({...state,selectedBookId:id}))
);

export function bookReducer(state:BookState,action:Action):BookState{
  return reducer(state,action);
}
