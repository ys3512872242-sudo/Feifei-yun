import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Person, Interaction } from '../../core/types'
import { generateId, now } from '../../shared/lib'

interface PeopleState {
  people: Person[]
  interactions: Interaction[]
  // Person CRUD
  addPerson: (data: Partial<Person>) => Person
  updatePerson: (id: string, updates: Partial<Person>) => void
  removePerson: (id: string) => void
  getPerson: (id: string) => Person | undefined
  // Interaction CRUD
  addInteraction: (data: Partial<Interaction>) => Interaction
  updateInteraction: (id: string, updates: Partial<Interaction>) => void
  removeInteraction: (id: string) => void
  getInteractionsByPerson: (personId: string) => Interaction[]
  getVentsByPerson: (personId: string) => Interaction[]
  // 统计
  getVentCountByPerson: (personId: string) => number
}

export const usePeopleStore = create<PeopleState>()(
  persist(
    (set, get) => ({
      people: [],
      interactions: [],

      addPerson: (data) => {
        const person: Person = {
          id: generateId(),
          name: data.name || '',
          avatar: data.avatar || '😊',
          relationship: data.relationship || 'friend',
          tags: data.tags || [],
          intimacy: data.intimacy || 3,
          firstMet: data.firstMet,
          notes: data.notes || '',
          createdAt: now(),
          updatedAt: now(),
        }
        set((s) => ({ people: [...s.people, person] }))
        return person
      },

      updatePerson: (id, updates) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: now() } : p
          ),
        })),

      removePerson: (id) =>
        set((s) => ({
          people: s.people.filter((p) => p.id !== id),
          interactions: s.interactions.filter((i) => i.personId !== id),
        })),

      getPerson: (id) => get().people.find((p) => p.id === id),

      addInteraction: (data) => {
        const interaction: Interaction = {
          id: generateId(),
          personId: data.personId || '',
          date: data.date || new Date().toISOString().slice(0, 10),
          type: data.type || 'chat',
          content: data.content || '',
          emotion: data.emotion || 'neutral',
          isVent: data.isVent || false,
          ventDetail: data.ventDetail,
          createdAt: now(),
        }
        set((s) => ({ interactions: [interaction, ...s.interactions] }))
        return interaction
      },

      updateInteraction: (id, updates) =>
        set((s) => ({
          interactions: s.interactions.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),

      removeInteraction: (id) =>
        set((s) => ({
          interactions: s.interactions.filter((i) => i.id !== id),
        })),

      getInteractionsByPerson: (personId) =>
        get().interactions.filter((i) => i.personId === personId),

      getVentsByPerson: (personId) =>
        get().interactions.filter((i) => i.personId === personId && i.isVent),

      getVentCountByPerson: (personId) =>
        get().interactions.filter((i) => i.personId === personId && i.isVent).length,
    }),
    { name: 'feifei-people', version: 1 }
  )
)
