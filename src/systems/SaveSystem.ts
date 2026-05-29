import type { SaveData } from '../types/SaveTypes'
import { StorageRepository } from './StorageRepository'

export class SaveSystem {
  private repo: StorageRepository
  private cache: SaveData | null = null

  constructor(repo?: StorageRepository) {
    this.repo = repo ?? new StorageRepository()
  }

  load(): SaveData {
    if (this.cache) return this.cache
    this.cache = this.repo.load()
    return this.cache
  }

  save(): void {
    if (!this.cache) return
    this.repo.save(this.cache)
  }

  update(mutator: (data: SaveData) => void): void {
    const data = this.load()
    mutator(data)
    this.save()
  }

  reset(): void {
    this.repo.reset()
    this.cache = null
  }
}
