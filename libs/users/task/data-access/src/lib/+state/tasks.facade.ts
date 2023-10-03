import { inject, Injectable } from '@angular/core';
import { tasksAction } from './tasks.action';
import { selectColumns } from './tasks.selector';
import { IColumn } from '../model/tasks.interface';
import { select, Store } from '@ngrx/store';
import { UsersDTO } from '@users/core/data-access';

@Injectable({
  providedIn: 'root',
})
export class TasksFacade {
  private readonly store = inject(Store);
  public allTaskColumns$ = this.store.pipe(select(selectColumns));

  getMyBoard() {
    this.store.dispatch(tasksAction.loadMyBoard());
  }

  getAllBoards() {
    this.store.dispatch(tasksAction.loadBoards());
  }
  updateColumns(columns: IColumn[]) {
    this.store.dispatch(tasksAction.updateColumns({ columns }));
  }
  
  addExecutor(executor: UsersDTO | null){
    this.store.dispatch(tasksAction.addExecutor({executor}));
  }

  deleteColumn(columnIndex: number) {
    this.store.dispatch(tasksAction.deleteColumn({ columnIndex }));
  }
}
