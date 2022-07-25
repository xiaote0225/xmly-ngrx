import { createSelector } from '@ngrx/store';
import { EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { adapter, BookState, BookFeatureKey, Book } from './reducer';

const {selectIds,selectEntities,selectAll,selectTotal} = adapter.getSelectors();

export const selectBookFeature = createFeatureSelector<BookState>(BookFeatureKey);

export const selectBookState = (state:EntityState<Book>) => state;

export const selectBookIds = createSelector(selectBookState,selectIds);
export const selectBookEntities = createSelector(selectBookState,selectEntities);
export const selectBookTotal = createSelector(selectBookState,selectTotal);
export const selectAllBook = createSelector(selectBookState,selectAll);

// export const selectedBookId = createSelector(
//   selectBookState,
//   (state:BookState) => state.selectedBookId
// )

// export const selectedBook = createSelector(
//   selectBookEntities,
//   selectedBookId,
//   (books,id) => books[id]
// );
