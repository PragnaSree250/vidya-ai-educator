import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { LoginPage, SignupPage } from './pages/AuthPages'
import { OnboardingPage } from './pages/OnboardingPage'
import { DashboardPage } from './pages/DashboardPage'
import { LearnPage } from './pages/LearnPage'
import { PlanPage } from './pages/PlanPage'
import { ClassroomPage } from './pages/ClassroomPage'
import { AssessPage } from './pages/AssessPage'
import { ReportPage } from './pages/ReportPage'
import { PathPage } from './pages/PathPage'
import { ProgressPage } from './pages/ProgressPage'
import { LibraryPage } from './pages/LibraryPage'
import { NotesPage } from './pages/NotesPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { TeachersPage } from './pages/TeachersPage'
import { SettingsPage } from './pages/SettingsPage'
import { RevisionPage } from './pages/RevisionPage'

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="plan/:id" element={<PlanPage />} />
            <Route path="classroom/:id" element={<ClassroomPage />} />
            <Route path="assess/:id" element={<AssessPage />} />
            <Route path="report/:id" element={<ReportPage />} />
            <Route path="path" element={<PathPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="revision" element={<RevisionPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}
