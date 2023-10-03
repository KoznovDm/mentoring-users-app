import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { UsersDTO, UsersEntity } from '@users/core/data-access';
import { UsersFacade } from '@users/users/data-access';
import { IColumn, ITask, TasksFacade } from '@users/users/task/data-access';
import { BehaviorSubject, Observable, tap } from 'rxjs';

type TaskColumnsState = {
  columns: IColumn[];
};

const initialState: TaskColumnsState = {
  columns: [],
};

@Injectable()
export class TasksStore extends ComponentStore<TaskColumnsState> {
  private readonly taskFacade = inject(TasksFacade);
  private readonly userFacade = inject(UsersFacade);

  public columns$ = this.select(({ columns }) => columns);
  public allUsers$!: Observable<UsersEntity[]>;
  public selectedExecutor$: BehaviorSubject<UsersDTO | null> = new BehaviorSubject<UsersDTO | null>(null);
  

  constructor() {
    super(initialState);
    this.setColumnsFromGlobalToLocalStore();
  }


  private setColumnsFromGlobalToLocalStore(): void {
    this.taskFacade.getMyBoard();
    this.taskFacade.getAllBoards();
    this.effect(() =>
      this.taskFacade.allTaskColumns$.pipe(
        tap((columns: IColumn[]) => {
          this.patchColumns(columns);
        })
      )
    );
  }

  private patchColumns(columns: IColumn[]): void {
    this.patchState({ columns });
  }
  public loadUsers(): void {
    this.userFacade.init();
    this.allUsers$ = this.userFacade.allUsers$;
  }
  public selectExecutor(user: UsersDTO | null) {
    this.selectedExecutor$.next(user);
    this.taskFacade.addExecutor(user)
  }

  public deleteColumn(columnIndex: number): void {
    this.taskFacade.deleteColumn(columnIndex);
  }

  public updateLocalColumns = this.updater((state, columns: IColumn[]) => {
    this.taskFacade.updateColumns(columns);
    return { ...state, columns };
});

public deleteLocalColumn = this.updater((state, columnIndex: number) => {
  const updatedColumns = [...state.columns];
  updatedColumns.splice(columnIndex, 1);
  this.taskFacade.updateColumns(updatedColumns);
  return { ...state, columns: updatedColumns };
});

public addTaskToLocalColumn = this.updater((state, { columnIndex, task }: { columnIndex: number, task: ITask }) => {
  const updatedColumns = [...state.columns];
  const column = { ...updatedColumns[columnIndex] };
  column.tasks = [...column.tasks, task];
  updatedColumns[columnIndex] = column;
  this.taskFacade.updateColumns(updatedColumns);
  return { ...state, columns: updatedColumns };
});

public deleteTask = this.updater((state, { columnIndex, taskName }: { columnIndex: number, taskName: string }) => {
  const updatedColumns = [...state.columns];
  const column = { ...updatedColumns[columnIndex] };
  column.tasks = column.tasks.filter(task => task.taskName !== taskName);
  updatedColumns[columnIndex] = column;
  this.taskFacade.updateColumns(updatedColumns);
  return { ...state, columns: updatedColumns };
});
}
