# Contributing to Nuxt Shadcn Tauri Dashboard

First off, thank you for considering contributing to this project! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots** if relevant
- **Specify your environment**: OS, Node version, pnpm version, Rust version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List examples** of how it would be used

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `pnpm install`
3. **Make your changes** and test them thoroughly
4. **Test in both web and Tauri modes**:
   - `pnpm dev` for web
   - `pnpm tauri:dev` for desktop
5. **Ensure code quality**:
   - Run `pnpm lint` and fix any issues
   - Follow the existing code style
6. **Commit your changes** using clear commit messages
7. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- Rust (for Tauri): https://www.rust-lang.org/tools/install

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nuxt-shadcn-tauri-dashboard.git
cd nuxt-shadcn-tauri-dashboard

# Install dependencies
pnpm install

# Start development
pnpm dev              # Web mode
pnpm tauri:dev        # Desktop mode
```

## Code Style

- Use **TypeScript** for type safety
- Follow **Vue 3 Composition API** patterns
- Use **UnoCSS utilities** for styling
- Keep components **small and focused**
- Write **descriptive variable and function names**

## Project Structure

```
components/     - Reusable Vue components
pages/         - Nuxt pages (auto-routing)
  tauri/       - Tauri-specific feature pages
composables/   - Vue composables
constants/     - App constants
lib/           - Utility functions
src-tauri/     - Tauri Rust backend
  src/         - Rust source code
  capabilities/ - Permission definitions
```

## Adding New Features

### Adding a New Tauri Page

1. Create a new Vue file in `pages/tauri/your-feature.vue`
2. Import required Tauri APIs
3. Use shadcn-vue components for UI
4. Add necessary permissions to `src-tauri/capabilities/default.json`
5. Add menu item to `constants/menus.ts`

### Adding a New UI Component

1. If it's a shadcn component, use: `pnpm dlx shadcn-vue@latest add component-name`
2. Custom components go in `components/` directory
3. Use TypeScript for props/emits
4. Keep it reusable and well-documented

## Testing

Before submitting a PR, please test:

- ✅ Web mode works (`pnpm dev`)
- ✅ Tauri desktop mode works (`pnpm tauri:dev`)
- ✅ No console errors
- ✅ Linting passes (`pnpm lint`)
- ✅ TypeScript compiles (`pnpm typecheck`)
- ✅ Build succeeds (`pnpm generate` and `pnpm tauri:build`)

## Commit Messages

Use clear and descriptive commit messages:

```
feat: Add clipboard integration page
fix: Resolve storage API error in Tauri v2
docs: Update README with new features
style: Format code with ESLint
refactor: Simplify window management logic
test: Add tests for storage operations
```

## Questions?

Feel free to open an issue with the `question` label if you have any questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏
