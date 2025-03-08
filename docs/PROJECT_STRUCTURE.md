# Project Structure and Conventions

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions and shared logic
├── types/                # TypeScript type definitions
├── styles/               # Global styles and Tailwind utilities
└── services/            # External service integrations

docs/                    # Project documentation
├── REQUIREMENTS.md      # Project requirements specification
├── API.md              # API documentation
└── DEVELOPMENT.md      # Development guidelines
```

## Naming Conventions

- Components: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`, `useAuth.ts`)
- Pages: lowercase with hyphens (e.g., `user-profile/page.tsx`)
- Types: PascalCase with type suffix (e.g., `UserType.ts`, `AuthProps.ts`)

## Component Structure

```typescript
// Component template
import { type FC } from 'react'
import styles from './ComponentName.module.css' // If using CSS modules

interface ComponentNameProps {
  // Props definition
}

export const ComponentName: FC<ComponentNameProps> = (props) => {
  return (
    // JSX
  )
}
```

## Working with Requirements

1. Requirements are documented in `docs/REQUIREMENTS.md`
2. Each feature should:
   - Have a clear description
   - List acceptance criteria
   - Include any technical constraints
   - Reference related components/files

## Development Workflow

1. Create feature branch from `main`
2. Implement feature following project conventions
3. Write tests if applicable
4. Submit PR with reference to requirements
5. Deploy to staging for review

## Using Cursor AI

1. Open relevant files in editor
2. Describe the feature or change needed
3. AI will suggest implementations based on:
   - Project conventions
   - Existing patterns
   - Best practices
4. Review and iterate on suggestions 