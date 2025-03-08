export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface DatabaseAdapter<T extends BaseEntity> {
  create(data: Omit<T, keyof BaseEntity>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
  findById(id: string): Promise<T | null>
  findMany(query?: Partial<T>): Promise<T[]>
}

export type StorageType = 'json' | 'postgres' | 'mongodb'

export interface DatabaseConfig {
  type: StorageType
  path?: string // For JSON storage
  url?: string // For database connections
} 