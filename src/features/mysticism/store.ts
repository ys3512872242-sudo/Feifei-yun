import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DailyFortune, TarotReading, MysticProfile } from '../../core/types'

interface MysticismState {
  fortunes: DailyFortune[]
  tarotReadings: TarotReading[]
  mysticProfile: MysticProfile
  // Fortunes
  addFortune: (fortune: DailyFortune) => void
  getTodayFortune: () => DailyFortune | undefined
  // Tarot
  addTarotReading: (reading: TarotReading) => void
  getTarotReadings: () => TarotReading[]
  // Profile
  updateMysticProfile: (updates: Partial<MysticProfile>) => void
}

export const useMysticismStore = create<MysticismState>()(
  persist(
    (set, get) => ({
      fortunes: [],
      tarotReadings: [],
      mysticProfile: { interestedIn: ['tarot', 'bazi', 'zodiac'] },

      addFortune: (fortune) =>
        set((s) => ({
          fortunes: [fortune, ...s.fortunes.filter((f) => f.date !== fortune.date)],
        })),

      getTodayFortune: () => {
        const today = new Date().toISOString().slice(0, 10)
        return get().fortunes.find((f) => f.date === today)
      },

      addTarotReading: (reading) =>
        set((s) => ({
          tarotReadings: [reading, ...s.tarotReadings],
        })),

      getTarotReadings: () => get().tarotReadings,

      updateMysticProfile: (updates) =>
        set((s) => ({
          mysticProfile: { ...s.mysticProfile, ...updates },
        })),
    }),
    { name: 'feifei-mysticism', version: 1 }
  )
)
