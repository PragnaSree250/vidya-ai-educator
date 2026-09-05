import type {
  LanguageCode,
  LearnerProfile,
  LearningReport,
  LessonPlan,
  Material,
  PathNode,
  QuizQuestion,
  SessionActivity,
  TeacherPersona,
} from '../types'

export const languages: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'bn', label: 'Bengali' },
  { code: 'mr', label: 'Marathi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
]

export const teachers: TeacherPersona[] = [
  {
    id: 'meera',
    name: 'Meera',
    title: 'Calm mentor',
    style: 'Patient, analogy-first, checks understanding before moving on.',
    languages: ['en', 'hi', 'te'],
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'arjun',
    name: 'Arjun',
    title: 'Exam coach',
    style: 'Structured, drill-based, highlights marks-weight concepts.',
    languages: ['en', 'hi', 'ta'],
    accent: 'from-teal-500 to-emerald-500',
  },
  {
    id: 'nova',
    name: 'Nova',
    title: 'Curious scientist',
    style: 'Visual demonstrations, experiments, “why does this happen?”',
    languages: ['en', 'es', 'fr'],
    accent: 'from-amber-400 to-orange-500',
  },
  {
    id: 'kiran',
    name: 'Kiran',
    title: 'Interview trainer',
    style: 'Practical examples, code walkthroughs, follow-up questions.',
    languages: ['en', 'hi'],
    accent: 'from-sky-500 to-brand-600',
  },
]

export const defaultProfile: LearnerProfile = {
  name: 'Aanya Sharma',
  role: 'student',
  level: 'beginner',
  priorKnowledge: 'School science up to Class 7. New to circuits.',
  objective: 'Finish Chapter 4 (Electricity) and score well in the unit test.',
  style: 'simple',
  language: 'hi',
  timeBudget: '20m',
  depth: 'standard',
}

export const materials: Material[] = [
  {
    id: 'ncert-10-science',
    name: 'NCERT Class 10 Science — Chapter 4 Electricity.pdf',
    type: 'pdf',
    pages: 28,
    language: 'en',
    chapters: ['Electric current', 'Potential difference', 'Ohm’s law', 'Resistance', 'Heating effect'],
    extractedConcepts: ['Current', 'Voltage', 'Ohm’s law', 'Resistance', 'Series vs parallel'],
  },
  {
    id: 'ml-notes',
    name: 'Intro to Machine Learning — lecture notes.docx',
    type: 'docx',
    pages: 14,
    language: 'en',
    chapters: ['What is ML', 'Supervised vs unsupervised', 'Train/test split'],
    extractedConcepts: ['Features', 'Labels', 'Overfitting'],
  },
  {
    id: 'react-slides',
    name: 'React for interviews.pptx',
    type: 'pptx',
    pages: 42,
    language: 'en',
    chapters: ['JSX', 'Hooks', 'State', 'Effects', 'Performance'],
    extractedConcepts: ['useState', 'useEffect', 're-renders'],
  },
]

export const electricityPlan: LessonPlan = {
  id: 'electricity-ch4',
  title: 'Electricity — Chapter 4, beginner, 20 minutes',
  source: 'upload',
  materialId: 'ncert-10-science',
  topic: 'Electricity',
  language: 'hi',
  level: 'beginner',
  timeBudget: '20m',
  visualsPlan:
    'Physics: circuit diagrams, Ohm’s law formula, current-vs-resistance graph. Language: Hindi teaching from English textbook.',
  steps: [
    {
      id: 's1',
      type: 'intro',
      title: 'Welcome & goal',
      durationMin: 2,
      visual: 'diagram',
      script:
        'In the next 20 minutes we will turn Chapter 4 into a simple story: current is flow, voltage is push, resistance is the squeeze.',
      scriptHi:
        'Agle 20 minute mein Chapter 4 ko seedhi kahani banate hain: current flow hai, voltage push hai, resistance squeeze hai.',
    },
    {
      id: 's2',
      type: 'explain',
      title: 'Current and voltage',
      durationMin: 5,
      visual: 'diagram',
      script: 'Current is the amount of charge flowing per second. Voltage is the push that makes charge move.',
      scriptHi: 'Current har second kitna charge flow karta hai. Voltage woh push hai jo charge ko chalta hai.',
    },
    {
      id: 's3',
      type: 'demonstrate',
      title: 'Ohm’s law on the board',
      durationMin: 5,
      visual: 'equation',
      script: 'V = IR. If voltage stays the same and resistance goes up, current must go down.',
      scriptHi: 'V = IR. Voltage same rahe aur resistance badhe, to current kam hoga.',
    },
    {
      id: 's4',
      type: 'question',
      title: 'Check-in question',
      durationMin: 3,
      visual: 'graph',
      script: 'What happens to current if resistance increases while voltage remains constant?',
      scriptHi: 'Agar voltage same ho aur resistance badhe, current kya hoga?',
    },
    {
      id: 's5',
      type: 'adapt',
      title: 'Re-explain with a new analogy',
      durationMin: 3,
      visual: 'process',
      script:
        'Think of a crowded doorway. Same push of people, narrower door — fewer people get through. That is Ohm’s law.',
      scriptHi:
        'Ek bheed wali darwaze ki tarah socho. Same push, lekin darwaza patla — kam log nikalte hain. Yahi Ohm’s law hai.',
    },
    {
      id: 's6',
      type: 'assess',
      title: 'Quick wrap-up quiz',
      durationMin: 2,
      visual: 'equation',
      script: 'Three short questions to confirm you can use Ohm’s law, not just repeat it.',
    },
  ],
}

export const liveQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    kind: 'mcq',
    prompt: 'What happens to current if resistance increases while voltage remains constant?',
    options: ['Current increases', 'Current decreases', 'Current stays the same', 'Voltage becomes zero'],
    correct: 'Current decreases',
    misconception: 'Confusing Ohm’s law direction — thinking more resistance “needs” more current.',
    alternative:
      'Picture a tap: same water pressure (voltage), a tighter pipe (resistance) means less water flowing (current).',
  },
  {
    id: 'q2',
    kind: 'own-words',
    prompt: 'Explain voltage in your own words, as if teaching a Class 8 friend.',
    correct: 'Voltage is the push that makes charge move through a circuit.',
  },
  {
    id: 'q3',
    kind: 'mcq',
    prompt: 'If V = 6 V and R = 3 Ω, what is the current?',
    options: ['2 A', '18 A', '0.5 A', '9 A'],
    correct: '2 A',
    misconception: 'Multiplying V and R instead of dividing.',
    alternative: 'I = V / R. 6 divided by 3 is 2 amperes.',
  },
]

export const assessmentQuestions: QuizQuestion[] = [
  {
    id: 'a1',
    kind: 'mcq',
    prompt: 'Ohm’s law relates which three quantities?',
    options: ['Mass, force, time', 'Voltage, current, resistance', 'Power, heat, light', 'Charge, mass, speed'],
    correct: 'Voltage, current, resistance',
  },
  {
    id: 'a2',
    kind: 'mcq',
    prompt: 'Two resistors in series…',
    options: [
      'Share the same current',
      'Always have zero resistance',
      'Increase current',
      'Cancel voltage',
    ],
    correct: 'Share the same current',
  },
  {
    id: 'a3',
    kind: 'short',
    prompt: 'A 12 V battery is connected to a 4 Ω resistor. Find the current.',
    correct: '3 A',
  },
  {
    id: 'a4',
    kind: 'problem',
    prompt: 'Why does a thin wire heat up more than a thick wire for the same current?',
    correct: 'Higher resistance converts more electrical energy to heat.',
  },
]

export const electricityReport: LearningReport = {
  topic: 'Electricity',
  score: 80,
  strong: ['Current', 'Voltage'],
  weak: ['Resistance', 'Ohm’s Law'],
  incorrect: ['Current increases when resistance increases'],
  revision: ['Revise Ohm’s Law', 'Complete two additional practice problems'],
  nextTopic: 'Series and parallel circuits',
}

export const mlPath: PathNode[] = [
  { id: 'p1', title: 'Python fundamentals', status: 'done', minutes: 45 },
  { id: 'p2', title: 'Mathematics for ML', status: 'done', minutes: 40 },
  { id: 'p3', title: 'Data processing', status: 'current', minutes: 35 },
  { id: 'p4', title: 'Supervised learning', status: 'locked', minutes: 50 },
  { id: 'p5', title: 'Unsupervised learning', status: 'locked', minutes: 40 },
  { id: 'p6', title: 'Model evaluation', status: 'locked', minutes: 30 },
  { id: 'p7', title: 'Neural networks', status: 'locked', minutes: 55 },
  { id: 'p8', title: 'Advanced machine learning', status: 'locked', minutes: 60 },
]

export const history: SessionActivity[] = [
  { id: 'h1', title: 'Electricity · Chapter 4', when: 'Today, 2:10 PM', score: 80, language: 'Hindi' },
  { id: 'h2', title: 'Newton’s laws · Class 8', when: 'Yesterday', score: 92, language: 'English' },
  { id: 'h3', title: 'React hooks for interviews', when: 'Mon', score: 74, language: 'English' },
  { id: 'h4', title: 'Photosynthesis overview', when: 'Sun', score: 88, language: 'Hindi' },
]

export const flashcards = [
  { front: 'Ohm’s law', back: 'V = I × R. Voltage equals current times resistance.' },
  { front: 'Current (I)', back: 'Flow of charge per second, measured in amperes (A).' },
  { front: 'Resistance', back: 'Opposition to current. Higher R → smaller I for the same V.' },
  { front: 'Voltage', back: 'The “push” that drives charge around a circuit.' },
]

export const notes = [
  {
    title: 'Electricity — beginner notes',
    body: 'Current is flow. Voltage is push. Resistance is squeeze. Always check units: V, A, Ω.',
  },
  {
    title: 'Misconception log',
    body: 'I previously thought more resistance means more current. Corrected with the doorway analogy.',
  },
]

export const topicSuggestions = [
  'Teach me Artificial Intelligence from the beginning',
  'Explain Newton’s Laws to a Class 8 student',
  'Teach me React for a technical interview',
  'I am a beginner. Teach me Chapter 4 in 20 minutes in Hindi',
]
