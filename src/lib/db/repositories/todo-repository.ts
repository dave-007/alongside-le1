import { JsonDatabaseAdapter } from '../json-adapter'
import { Todo, CreateTodoInput } from '../entities/todo'

export class TodoRepository {
  private adapter: JsonDatabaseAdapter<Todo>

  constructor() {
    this.adapter = new JsonDatabaseAdapter<Todo>('todos')
  }

  async createTodo(data: CreateTodoInput): Promise<Todo> {
    return this.adapter.create(data)
  }

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    return this.adapter.update(id, data)
  }

  async deleteTodo(id: string): Promise<void> {
    return this.adapter.delete(id)
  }

  async getTodoById(id: string): Promise<Todo | null> {
    return this.adapter.findById(id)
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.adapter.findMany()
  }

  async getCompletedTodos(): Promise<Todo[]> {
    return this.adapter.findMany({ completed: true })
  }

  async getIncompleteTodos(): Promise<Todo[]> {
    return this.adapter.findMany({ completed: false })
  }
} 