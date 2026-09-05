export type UserRole = 'student' | 'guest'

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'es'
  | 'fr'

export type Level = 'beginner' | 'intermediate' | 'advanced'
export type TeachingStyle = 'simple' | 'socratic' | 'exam' | 'story'
export type TimeBudget = '5m' | '20m' | '60m' | '7d'
export type VisualKind =
  | 'equation'
  | 'graph'
  | 'diagram'
  | 'timeline'
  | 'map'
  | 'code'
  | 'biology'
  | 'process'

export type TeacherPersona = {
  id: string
  name: string
  title: string
  style: string
  languages: LanguageCode[]
  accent: string
}

export type LearnerProfile = {
  name: string
  role: UserRole
  level: Level
  priorKnowledge: string
  objective: string
  style: TeachingStyle
  language: LanguageCode
  timeBudget: TimeBudget
  depth: 'overview' | 'standard' | 'deep'
}

export type Material = {
  id: string
  name: string
  type: 'pdf' | 'docx' | 'pptx' | 'notes' | 'paper'
  pages: number
  language: LanguageCode
  chapters: string[]
  extractedConcepts: string[]
}

export type LessonStep = {
  id: string
  type: 'intro' | 'explain' | 'demonstrate' | 'question' | 'adapt' | 'assess'
  title: string
  durationMin: number
  visual: VisualKind
  script: string
  scriptHi?: string
}

export type LessonPlan = {
  id: string
  title: string
  source: 'upload' | 'topic'
  materialId?: string
  topic: string
  language: LanguageCode
  level: Level
  timeBudget: TimeBudget
  steps: LessonStep[]
  visualsPlan: string
}

export type QuizQuestion = {
  id: string
  kind: 'mcq' | 'short' | 'own-words' | 'problem'
  prompt: string
  options?: string[]
  correct?: string
  misconception?: string
  alternative?: string
}

export type LearningReport = {
  topic: string
  score: number
  strong: string[]
  weak: string[]
  incorrect: string[]
  revision: string[]
  nextTopic: string
}

export type PathNode = {
  id: string
  title: string
  status: 'done' | 'current' | 'locked'
  minutes: number
}

export type SessionActivity = {
  id: string
  title: string
  when: string
  score?: number
  language: string
}
