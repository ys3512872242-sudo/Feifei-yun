import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, UserPreference } from '../../core/types'
import { generateId, now } from '../../shared/lib'

const DEFAULT_PREFERENCES: UserPreference = {
  feedbackStyle: 'gentle',
  interestTopics: [],
  calibrationHistory: [],
}

const DEFAULT_PROFILE: UserProfile = {
  strengths: [],
  patterns: [],
  skills: [],
  preferences: DEFAULT_PREFERENCES,
  createdAt: now(),
  updatedAt: now(),
}

interface DiscoveryState {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
  updatePreferences: (updates: Partial<UserPreference>) => void
  addStrength: (name: string, description: string) => void
  confirmStrength: (id: string) => void
  addSkill: (name: string, category: string, level: number) => void
  updateSkillLevel: (id: string, level: number, source: string) => void
}

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, _get) => ({
      profile: DEFAULT_PROFILE,

      updateProfile: (updates) =>
        set((s) => ({
          profile: { ...s.profile, ...updates, updatedAt: now() },
        })),

      updatePreferences: (updates) =>
        set((s) => ({
          profile: {
            ...s.profile,
            preferences: { ...s.profile.preferences, ...updates },
            updatedAt: now(),
          },
        })),

      addStrength: (name, description) =>
        set((s) => ({
          profile: {
            ...s.profile,
            strengths: [
              ...s.profile.strengths,
              {
                id: generateId(),
                name,
                description,
                evidence: [],
                confidence: 0.5,
                discoveredAt: now(),
                confirmedByUser: false,
              },
            ],
            updatedAt: now(),
          },
        })),

      confirmStrength: (id) =>
        set((s) => ({
          profile: {
            ...s.profile,
            strengths: s.profile.strengths.map((st) =>
              st.id === id ? { ...st, confirmedByUser: true, confidence: Math.min(st.confidence + 0.2, 1) } : st
            ),
            updatedAt: now(),
          },
        })),

      addSkill: (name, category, level) =>
        set((s) => ({
          profile: {
            ...s.profile,
            skills: [
              ...s.profile.skills,
              {
                id: generateId(),
                name,
                category,
                level,
                growthHistory: [{ date: new Date().toISOString().slice(0, 10), level, source: '初始评估' }],
              },
            ],
            updatedAt: now(),
          },
        })),

      updateSkillLevel: (id, level, source) =>
        set((s) => ({
          profile: {
            ...s.profile,
            skills: s.profile.skills.map((sk) =>
              sk.id === id
                ? {
                    ...sk,
                    level,
                    growthHistory: [
                      ...sk.growthHistory,
                      { date: new Date().toISOString().slice(0, 10), level, source },
                    ],
                  }
                : sk
            ),
            updatedAt: now(),
          },
        })),
    }),
    { name: 'feifei-discovery', version: 1 }
  )
)
