# Contributing Guidelines

Thank you for your interest in contributing to our Next.js presentation platform! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/repository-name.git`
3. Set up the development environment following the [Setup Guide](SETUP_GUIDE.md)
4. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes following the project's coding standards
2. Write or update tests as necessary
3. Ensure all tests pass
4. Update documentation if needed
5. Commit your changes with clear, descriptive commit messages
6. Push your branch to your fork
7. Submit a pull request to the main repository

## Pull Request Process

1. Ensure your PR addresses a specific issue or feature
2. Link the PR to any relevant issues
3. Include a clear description of the changes
4. Update the README.md or documentation if necessary
5. The PR will be reviewed by maintainers who may request changes
6. Once approved, your PR will be merged

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Ensure proper typing for all variables, functions, and components
- Avoid using `any` type when possible
- Use interfaces for object shapes and types for unions/primitives

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
const user: any = { id: '1', name: 'John' };
```

### React Components

- Use functional components with hooks
- Follow the project's component structure
- Use proper prop typing
- Implement error boundaries where appropriate

```typescript
import { FC } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="btn btn-primary"
    >
      {label}
    </button>
  );
};
```

### Styling

- Use Tailwind CSS for styling
- Follow the project's design system
- Ensure responsive design for all components
- Use CSS modules for component-specific styles when needed

### Testing

- Write tests for all new features
- Update tests when modifying existing features
- Aim for good test coverage
- Use React Testing Library for component tests

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

## Documentation

- Update documentation for any new features or changes
- Document APIs using the format in [API.md](API.md)
- Keep the README.md up to date
- Add comments to complex code sections

## Feature Requests and Bug Reports

- Use the issue tracker to report bugs or request features
- Check existing issues before creating a new one
- Provide detailed information when reporting bugs
- For feature requests, explain the use case and benefits

## Questions and Discussions

If you have questions or want to discuss ideas:

- Open a discussion in the GitHub Discussions section
- Join our community chat (if available)
- Reach out to the maintainers

Thank you for contributing to our project! 