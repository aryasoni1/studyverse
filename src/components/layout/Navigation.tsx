import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/roadmaps', label: 'Roadmaps' },
  { href: '/app/notes', label: 'Notes' },
  { href: '/app/community', label: 'Community' },
  { href: '/app/ai-assistant', label: 'AI Assistant' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'nav-link text-sm font-medium transition-colors hover:text-primary',
            location.pathname === item.href
              ? 'text-primary active'
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}