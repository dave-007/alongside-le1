import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { BaseEntity, DatabaseAdapter } from './types'

export class JsonDatabaseAdapter<T extends BaseEntity> implements DatabaseAdapter<T> {
  private filePath: string
  private data: T[] = []

  constructor(entity: string) {
    this.filePath = path.join(process.cwd(), 'data', `${entity}.json`)
  }

  private async ensureFile() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true })
      try {
        await fs.access(this.filePath)
      } catch {
        await fs.writeFile(this.filePath, '[]')
      }
    } catch (error) {
      console.error('Error ensuring file exists:', error)
      throw error
    }
  }

  private async load() {
    await this.ensureFile()
    const content = await fs.readFile(this.filePath, 'utf-8')
    this.data = JSON.parse(content)
  }

  private async save() {
    await this.ensureFile()
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2))
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    await this.load()
    const now = new Date().toISOString()
    const newItem = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    } as T

    this.data.push(newItem)
    await this.save()
    return newItem
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.load()
    const index = this.data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Item not found')

    const updatedItem = {
      ...this.data[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.data[index] = updatedItem
    await this.save()
    return updatedItem
  }

  async delete(id: string): Promise<void> {
    await this.load()
    this.data = this.data.filter(item => item.id !== id)
    await this.save()
  }

  async findById(id: string): Promise<T | null> {
    await this.load()
    return this.data.find(item => item.id === id) || null
  }

  async findMany(query?: Partial<T>): Promise<T[]> {
    await this.load()
    if (!query) return this.data

    return this.data.filter(item =>
      Object.entries(query).every(([key, value]) => item[key as keyof T] === value)
    )
  }
} 