import { UsersDTO } from "@users/core/data-access";

export interface ITaskBoard {
  id: number;
  created_at: number;
  email: string;
  authorId: number;
  columns: IColumn[];
}

export interface ITask {
  taskName: string;
  executor?: UsersDTO;
}

export interface IColumn {
  columnName: string;
  tasks: ITask[];
}
