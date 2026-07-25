import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Inspiration } from '../../core/types'
import { generateId, now } from '../../shared/lib'

interface InspirationState {
  inspirations: Inspiration[]
  add: (data: Partial<Inspiration>) => Inspiration
  update: (id: string, updates: Partial<Inspiration>) => void
  remove: (id: string) => void
  getById: (id: string) => Inspiration | undefined
  getByStatus: (status: Inspiration['status']) => Inspiration[]
  search: (query: string) => Inspiration[]
}

export const useInspirationStore = create<InspirationState>()(
  persist(
    (set, get) => ({
      inspirations: [],

      add: (data) => {
        const item: Inspiration = {
          id: generateId(),
          content: data.content || '',
          inspirationType: data.inspirationType || 'observation',
          tags: data.tags || [],
          emotion: data.emotion || 'neutral',
          source: data.source,
          relatedTaskId: data.relatedTaskId,
          relatedPersonId: data.relatedPersonId,
          createdAt: now(),
          updatedAt: now(),
          status: 'raw',
        }
        set((s) => ({ inspirations: [item, ...s.inspirations] }))
        return item
      },

      update: (id, updates) =>
        set((s) => ({
          inspirations: s.inspirations.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: now() } : i
          ),
        })),

      remove: (id) =>
        set((s) => ({
          inspirations: s.inspirations.filter((i) => i.id !== id),
        })),

      getById: (id) => get().inspirations.find((i) => i.id === id),

      getByStatus: (status) =>
        get().inspirations.filter((i) => i.status === status),

      search: (query) => {
        const q = query.toLowerCase()
        return get().inspirations.filter(
          (i) =>
            i.content.toLowerCase().includes(q) ||
            i.tags.some((t) => t.toLowerCase().includes(q))
        )
      },
    }),
    { name: 'feifei-inspirations', version: 1 }
  )
)
