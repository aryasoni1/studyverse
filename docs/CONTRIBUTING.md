# Contributing to SkillForge

Thank you for your interest in contributing to SkillForge! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18+ 
- Git
- A GitHub account
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/skillforge.git
cd skillforge
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env.local
# Update .env.local with your values
```

5. Start the development server:
```bash
npm run dev
```

## Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:
- `feature/feature-name` - for new features
- `fix/bug-description` - for bug fixes
- `docs/documentation-update` - for documentation changes
- `refactor/component-name` - for refactoring
- `test/test-description` - for adding tests

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation changes
- `style`: formatting, missing semicolons, etc.
- `refactor`: code refactoring
- `test`: adding tests
- `chore`: maintenance tasks

Examples:
```
feat(auth): add Google OAuth integration
fix(dashboard): resolve loading state issue
docs(api): update authentication endpoints
```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all props and functions
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes
- Export types alongside components

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  // Component implementation
}
```

### React Components

- Use functional components with hooks
- Follow single responsibility principle
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper error boundaries

```typescript
// Good: Small, focused component
function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  return (
    <Avatar className={cn('rounded-full', sizeClasses[size])}>
      <AvatarImage src={user.avatar_url} alt={user.name} />
      <AvatarFallback>{user.name[0]}</AvatarFallback>
    </Avatar>
  );
}

// Avoid: Large, multi-purpose components
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theme colors
- Implement consistent spacing (8px grid)
- Add hover states and transitions

```typescript
// Good: Tailwind utilities with consistent spacing
<Button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">

// Avoid: Inline styles or non-standard spacing
<Button style={{ padding: '7px 15px', backgroundColor: '#ff0000' }}>
```

### File Organization

- Use feature-based folder structure
- Keep related files together
- Follow naming conventions
- Export from index files when appropriate

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   └── index.ts
├── api/
│   └── authApi.ts
└── types/
    └── auth.ts
```

## Testing

### Unit Tests

- Write tests for all utility functions
- Test component behavior, not implementation
- Use descriptive test names
- Mock external dependencies

```typescript
describe('formatDate', () => {
  it('should format date in MM/DD/YYYY format', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('01/15/2024');
  });

  it('should handle invalid dates', () => {
    expect(formatDate(null)).toBe('Invalid Date');
  });
});
```

### Component Tests

```typescript
describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests

- Test critical user journeys
- Use page object pattern
- Keep tests independent
- Use data-testid attributes for reliable selectors

## Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props
- Include usage examples
- Explain non-obvious logic

```typescript
/**
 * Formats a date string into a human-readable format
 * @param date - The date to format
 * @param format - The desired format ('short' | 'long' | 'relative')
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'short') // '01/15/2024'
 * formatDate(new Date(), 'relative') // '2 days ago'
 */
function formatDate(date: Date, format: DateFormat = 'short'): string {
  // Implementation
}
```

### Storybook

- Create stories for all UI components
- Include different states and variants
- Add interactive controls
- Document component usage

```typescript
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
  },
} satisfies Meta<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

## Pull Request Process

### Before Submitting

1. Run the test suite: `npm test`
2. Run linting: `npm run lint`
3. Check TypeScript: `npm run type-check`
4. Test your changes manually
5. Update documentation if needed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Process

1. Automated checks must pass
2. At least one code review required
3. Address feedback promptly
4. Maintain clean git history
5. Squash commits if requested

## Issue Reporting

### Bug Reports

Use the bug report template:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests

Use the feature request template:
- Problem description
- Proposed solution
- Alternative solutions considered
- Additional context

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Avoid discriminatory language
- Report inappropriate behavior

### Communication

- Use clear, concise language
- Provide context in discussions
- Be patient with responses
- Ask questions if unclear
- Share knowledge generously

## Resources

### Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Testing Library Docs](https://testing-library.com/docs/)

### Tools

- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

## Getting Help

- Create an issue for bugs or questions
- Join our Discord community
- Check existing documentation
- Review similar issues or PRs

Thank you for contributing to SkillForge! 🚀