import { Observable } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UsersFacade } from '@users/users/data-access';
import { MatSelectModule } from '@angular/material/select';
import { PushPipe } from '@ngrx/component';
import { UsersDTO, UsersEntity } from '@users/core/data-access';
import { TasksStore } from '../tasks-view-container/tasks-list-container.store';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'users-tasks-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    PushPipe,
  ],
  templateUrl: './tasks-create-dialog.component.html',
  styleUrls: ['./tasks-create-dialog.component.scss'],
  providers: [TasksStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksCreateDialogComponent {
  private readonly tasksStore = inject(TasksStore);
  private dialogRef = inject(MatDialogRef<TasksCreateDialogComponent>);

  public allUsers$!: Observable<UsersEntity[]>;
  public executor?: UsersDTO;
  public task = '';

  constructor()
  {
    this.tasksStore.loadUsers();
    this.allUsers$ = this.tasksStore.allUsers$;
  }

public create(): void {
  this.dialogRef.close({ taskName: this.task, executor: this.executor });
}

  public cancel(): void {
    this.dialogRef.close(null);
  }
}


