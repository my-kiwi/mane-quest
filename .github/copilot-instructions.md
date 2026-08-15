# Copilot Instructions

## Project Overview
This is a TypeScript/Vite frontend project with vitest for testing and ESLint for code quality.

## Code Style & Standards
- **Language**: TypeScript (strict mode)
- **Linter**: ESLint - follow all linting rules
- **Formatting**: Code should pass ESLint checks before submission
- **Build Tool**: Vite for bundling and development

## Project Structure
- `src/` - All source code
  - `*.ts` - TypeScript modules
  - `*.test.ts` - Unit tests using vitest
- `index.html` - Entry point
- `styles.css` - Global styles
- Configuration files in root directory

## Key Components
- `main.ts` - Application entry point
- `App.ts` - Main application component
- `Counter.ts` - Counter component
- `GithubLink.ts` - GitHub link component

## Testing Requirements
- Use vitest for all unit tests
- Test files should match the pattern `*.test.ts`
- Run tests with `npm run test`
- Ensure good test coverage for new features

## Build & Development
- Development: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Test: `npm run test`

## Code Guidelines
1. Write modular, reusable components
2. Keep functions small and focused
3. Use TypeScript types explicitly
4. Add tests for new functionality
5. Follow the existing code patterns in the project
6. Ensure all code passes linting before commit

## Common Patterns
- Use TypeScript for all new code
- Export components and utilities as named exports
- Keep CSS classes semantic and descriptive
- Use relative imports within src/
