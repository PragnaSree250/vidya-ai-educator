import { Link } from 'react-router-dom'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'

export function MarketingNav() {
  return (
    <header className="container-page flex items-center justify-between py-5">
      <Link to="/">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <a href="#how">How it teaches</a>
        <a href="#features">Features</a>
        <a href="#languages">Languages</a>
      </nav>
      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
        <Link to="/signup">
          <Button size="sm">Start learning</Button>
        </Link>
      </div>
    </header>
  )
}
