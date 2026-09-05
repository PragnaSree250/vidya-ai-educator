import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Library,
  NotebookPen,
  Route,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useSession } from '../../context/SessionContext'
import { Button } from '../ui/Button'

const links = [
  { to: '/app', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/learn', label: 'Start lesson', icon: Sparkles },
  { to: '/app/library', label: 'Materials', icon: Library },
  { to: '/app/path', label: 'Learning path', icon: Route },
  { to: '/app/progress', label: 'Progress', icon: GraduationCap },
  { to: '/app/notes', label: 'Notes', icon: NotebookPen },
  { to: '/app/flashcards', label: 'Flashcards', icon: BookOpen },
  { to: '/app/teachers', label: 'Teachers', icon: Users },
  { to: '/app/revision', label: 'Revision', icon: Compass },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  const { profile, teacher } = useSession()
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="px-5 py-5">
          <Logo />
          <p className="mt-1 text-xs text-slate-500">Human-like AI educator</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 pb-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  isActive ? 'bg-brand-50 font-medium text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <p className="text-sm font-medium">{profile.name}</p>
          <p className="text-xs text-slate-500">
            {teacher.name} · {profile.level}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <Logo />
          <Button size="sm" variant="secondary" onClick={() => nav('/app/learn')}>
            Learn
          </Button>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
        <nav className="sticky bottom-0 grid grid-cols-5 border-t border-slate-200 bg-white px-1 py-2 text-[11px] lg:hidden">
          {links.slice(0, 5).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg py-1 ${isActive ? 'text-brand-700' : 'text-slate-500'}`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label.split(' ')[0]}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
