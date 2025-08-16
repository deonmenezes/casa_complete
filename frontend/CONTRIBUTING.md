# Contributing to Project Casa 🤝

Thank you for your interest in contributing to Project Casa! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/project-casa.git`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open http://localhost:5173

## 📋 How to Contribute

### 🐛 Reporting Bugs
1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### 💡 Suggesting Features
1. Check existing feature requests
2. Use the feature request template
3. Explain:
   - The problem you're solving
   - Your proposed solution
   - Alternative solutions considered
   - Additional context

### 🔧 Code Contributions

#### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(homepage): add gender filtering functionality
fix(checkout): resolve payment method selection bug
docs(readme): update installation instructions
```

#### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add/update tests if applicable
4. Update documentation if needed
5. Ensure all tests pass: `npm run test`
6. Run linting: `npm run lint`
7. Create a pull request with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - Testing instructions

## 🎨 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement error boundaries where needed

### Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use semantic HTML elements

### File Organization
- Keep components small and focused
- Use proper folder structure
- Export components from index files
- Group related functionality

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Writing Tests
- Write tests for new features
- Test edge cases and error conditions
- Use descriptive test names
- Mock external dependencies

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props and interfaces
- Include usage examples
- Keep comments up to date

### README Updates
- Update README for new features
- Include screenshots for UI changes
- Update installation/setup instructions
- Add new dependencies to tech stack

## 🔍 Code Review Process

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Keep discussions professional
- Ask questions if unclear

### For Reviewers
- Be constructive and helpful
- Focus on code quality and maintainability
- Check for security issues
- Verify functionality works as expected

## 🏷️ Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 🤔 Questions?

- Check existing [Issues](https://github.com/vinyashegde/project-casa/issues)
- Start a [Discussion](https://github.com/vinyashegde/project-casa/discussions)
- Contact maintainers

## 📜 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

Thank you for contributing to Project Casa! 🎉
