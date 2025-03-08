import { BaseEntity } from '../types'

export interface Todo extends BaseEntity {
  title: string
  description?: string
  completed: boolean
  dueDate?: string
}

export type CreateTodoInput = Omit<Todo, keyof BaseEntity> 