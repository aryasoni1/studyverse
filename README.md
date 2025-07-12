# StudyVerse

A modern, scalable skill development platform built with React, TypeScript, and Supabase.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase for authentication, database, and edge functions
- **UI Components**: ShadCN/ui component library
- **Testing**: Vitest for unit tests, Cypress for E2E testing
- **Documentation**: Storybook for component documentation
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## 📁 Project Structure

```
skillforge/
├── src/
│   ├── app/                    # Application entry point
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # ShadCN components
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Shared components
│   │   ├── forms/             # Form components
│   │   └── landing/           # Landing page components
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication
│   │   ├── dashboard/         # Dashboard
│   │   ├── career/            # Career planning
│   │   ├── community/         # Community features
│   │   ├── notes/             # Note-taking
│   │   ├── roadmaps/          # Learning roadmaps
│   │   ├── study-room/        # Study sessions
│   │   ├── watch-together/    # Collaborative watching
│   │   ├── ai-assistant/      # AI-powered assistance
│   │   ├── discovery/         # Content discovery
│   │   ├── seo/               # SEO optimization
│   │   ├── profile/           # User profiles
│   │   └── account/           # Account management
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── styles/                # Global styles and themes
│   ├── test/                  # Test utilities and setup
│   └── types/                 # TypeScript type definitions
├── supabase/                  # Supabase configuration
├── scripts/                   # Build and deployment scripts
├── docs/                      # Project documentation
├── cypress/                   # E2E test configuration
└── .storybook/               # Storybook configuration
```

## 🛠 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend features)

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env.local`
4. Run setup script: `npm run setup`
5. Start development server: `npm run dev`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run storybook` - Start Storybook
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)

## 🏗 Architecture

This project follows a feature-based architecture where each feature is self-contained with its own components, hooks, API calls, schemas, and types. This approach ensures scalability and maintainability as the project grows.

## 🤝 Contributing

Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) before submitting any changes.

## 📄 License

This project is licensed under the MIT License.

## Judge Quick Access

- [Notes](https://your-netlify-site-url/notes)
- [Dashboard](https://your-netlify-site-url/dashboard)
- [Study Room](https://your-netlify-site-url/study-room)

**Test User:**

- Email: `judge@demo.com`
- Password: `judge1234`
