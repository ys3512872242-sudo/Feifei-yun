// ========== 灵感速记 ==========

export type EmotionType = 'excited' | 'calm' | 'anxious' | 'curious' | 'tired' | 'inspired' | 'neutral'
export type InspirationStatus = 'raw' | 'deepening' | 'cultivating' | 'archived'
export type JudgmentLevel = 'cultivate' | 'incubate' | 'archive'
export type QuestionType = 'why' | 'how' | 'what_if' | 'expand' | 'connect'
export type InspirationType = 'creative' | 'observation' | 'emotion' | 'knowledge' | 'intuition'

export interface DeepeningQuestion {
  id: string
  question: string
  type: QuestionType
  answered: boolean
}

export interface UserAnswer {
  questionId: string
  answer: string
  answeredAt: number
}

export interface ValueJudgment {
  level: JudgmentLevel
  reasons: string[]
  judgedAt: number
  nextStep?: string
}

export interface DeepeningConversation {
  questions: DeepeningQuestion[]
  userAnswers: UserAnswer[]
  status: 'pending' | 'answering' | 'completed'
  startedAt: number
}

export interface Resource {
  type: 'inspiration' | 'task' | 'person' | 'link'
  id: string
  title: string
  reason: string
}

export interface Inspiration {
  id: string
  content: string
  inspirationType: InspirationType
  tags: string[]
  emotion: EmotionType
  source?: string
  relatedTaskId?: string
  relatedPersonId?: string
  createdAt: number
  updatedAt: number
  // 灵感深化
  status: InspirationStatus
  valueJudgment?: ValueJudgment
  deepeningConversation?: DeepeningConversation
  relatedInspirations?: string[]
  relatedResources?: Resource[]
  // AI 元数据
  aiMetadata?: {
    polishedContent?: string
    autoTags?: string[]
    reasoningChain?: ReasoningStep[]
  }
}

// ========== 自我发现 ==========

export interface Evidence {
  id: string
  sourceType: 'task' | 'inspiration' | 'pattern' | 'user_feedback'
  sourceId: string
  description: string
  createdAt: number
}

export interface Strength {
  id: string
  name: string
  description: string
  evidence: Evidence[]
  confidence: number
  discoveredAt: number
  confirmedByUser: boolean
}

export interface PatternObservation {
  date: string
  event: string
  context: string
}

export interface BehaviorPattern {
  id: string
  name: string
  description: string
  type: 'work' | 'emotion' | 'social' | 'creative'
  observations: PatternObservation[]
  confidence: number
  discoveredAt: number
  reasoningChain?: ReasoningStep[]
}

export interface GrowthPoint {
  date: string
  level: number
  source: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  growthHistory: GrowthPoint[]
}

export interface UserPreference {
  feedbackStyle: 'gentle' | 'direct' | 'analytical'
  interestTopics: string[]
  calibrationHistory: string[] // calibration record IDs
}

export interface UserProfile {
  strengths: Strength[]
  patterns: BehaviorPattern[]
  skills: Skill[]
  preferences: UserPreference
  createdAt: number
  updatedAt: number
}

// ========== 玄学模块 ==========

export interface DailyFortune {
  date: string
  overall: number
  categories: {
    study: number
    love: number
    creativity: number
    social: number
  }
  description: string
  luckyColor: string
  luckyNumber: number
  advice: string
  disclaimer: string
  generatedAt: number
  reasoningChain?: ReasoningStep[]
}

export interface TarotCardResult {
  cardId: number
  name: string
  nameZh: string
  position: 'upright' | 'reversed'
  positionName?: string
}

export interface TarotReading {
  id: string
  date: string
  spreadType: 'single' | 'three-card'
  question?: string
  cards: TarotCardResult[]
  interpretation: string
  reflection?: string
  reasoningChain?: ReasoningStep[]
  createdAt: number
}

export interface BaziPillar {
  heavenlyStem: string
  earthlyBranch: string
  hiddenStems: string[]
}

export interface BaziProfile {
  birthDate: string
  birthTime: string
  gender: 'male' | 'female'
  pillars?: {
    year: BaziPillar
    month: BaziPillar
    day: BaziPillar
    hour: BaziPillar
  }
}

export interface MysticProfile {
  baziProfile?: BaziProfile
  zodiacSign?: string
  interestedIn: ('tarot' | 'bazi' | 'zodiac')[]
}

// ========== 人际关系 ==========

export type RelationshipType = 'family' | 'close_friend' | 'friend' | 'classmate' | 'teacher' | 'colleague' | 'acquaintance' | 'other'

export interface Person {
  id: string
  name: string
  avatar: string
  relationship: RelationshipType
  tags: string[]
  intimacy: number
  firstMet?: string
  notes: string
  createdAt: number
  updatedAt: number
}

export interface VentDetail {
  trigger: string
  feeling: string
  resolved: boolean
  reflection?: string
}

export interface Interaction {
  id: string
  personId: string
  date: string
  type: 'chat' | 'meet' | 'call' | 'online' | 'event'
  content: string
  emotion: EmotionType
  isVent: boolean
  ventDetail?: VentDetail
  createdAt: number
}

// ========== 任务管理 ==========

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskType = 'task' | 'deadline' | 'class'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  type: TaskType
  tags: string[]
  dueDate?: number
  scheduledDate?: string
  estimatedMinutes?: number
  actualMinutes?: number
  relatedInspirationIds?: string[]
  relatedPersonIds?: string[]
  completedAt?: number
  createdAt: number
  updatedAt: number
  // 课程特有
  courseName?: string
  classroom?: string
  teacher?: string
  weekDay?: number
  startTime?: string
  endTime?: string
}

// ========== 专注工具 ==========

export interface FocusSession {
  id: string
  taskId?: string
  startTime: number
  endTime?: number
  duration: number
  type: 'pomodoro' | 'short_break' | 'long_break' | 'free'
  completed: boolean
  interrupted: boolean
  notes?: string
}

export interface PomodoroSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
}

// ========== 信任机制 ==========

export interface ReasoningStep {
  id: string
  step: number
  type: 'data' | 'analysis' | 'inference' | 'conclusion' | 'charter_ref'
  content: string
  source?: string
  charterRef?: string
  confidence?: number
}

export interface CalibrationRecord {
  id: string
  targetType: string
  targetId: string
  action: 'agree' | 'disagree' | 'modify'
  originalContent?: string
  modifiedContent?: string
  userComment?: string
  createdAt: number
  applied: boolean
}

// ========== 原则宪章 ==========

export interface CharterPrinciple {
  id: string
  title: string
  description: string
  icon: string
  rules: string[]
}

// ========== 内容中心 ==========

export type ContentType = 'article' | 'video' | 'image' | 'audio' | 'link' | 'note'
export type ContentCategory = 'social_media' | 'academic' | 'creative' | 'reference' | 'personal'

export interface Content {
  id: string
  title: string
  description?: string
  type: ContentType
  category: ContentCategory
  url?: string
  tags: string[]
  relatedInspirationIds?: string[]
  relatedPersonIds?: string[]
  createdAt: number
  updatedAt: number
}

// ========== 顶层 Schema ==========

export interface LocalStorageSchema {
  version: number
  inspirations: Inspiration[]
  userProfile: UserProfile
  dailyFortunes: DailyFortune[]
  tarotReadings: TarotReading[]
  mysticProfile: MysticProfile
  people: Person[]
  interactions: Interaction[]
  tasks: Task[]
  focusSessions: FocusSession[]
  pomodoroSettings: PomodoroSettings
  contents: Content[]
  calibrationRecords: CalibrationRecord[]
  charterVersion: string
  onboardingCompleted: boolean
}
