# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-03

### Added
- Initial release of Nuxt Shadcn Tauri Dashboard
- **Nuxt 4.1.2** integration with Tauri 2.2.0
- Five Tauri feature pages:
  - System Information - Display OS details
  - Storage - Persistent key-value store
  - File System - Read/write operations with dialogs
  - Notifications - System notification integration
  - Interface - Window management controls
- Fullscreen toggle in header (Tauri mode only)
- Theme customization with persistent storage
  - Color themes (Zinc, Rose, Blue, Green, Orange, Red, Slate, Stone, Gray, Neutral, Yellow, Violet)
  - Border radius adjustment
  - Light/Dark/System mode
  - Settings saved to Tauri Store in desktop mode
  - Settings saved to localStorage in web mode
- Complete shadcn-vue component library integration
- UnoCSS with system font fallbacks
- Comprehensive documentation:
  - README.md - Project overview and setup
  - CONTRIBUTING.md - Contribution guidelines
  - PROJECT_OVERVIEW.md - Technical deep dive
  - PRESENTATION_GUIDE.md - Pitch deck and talking points
  - GITHUB_SETUP.md - Repository setup guide
- GitHub templates for issues and pull requests
- Cross-platform build support (Windows, macOS, Linux)

### Fixed
- Component auto-import conflicts with shadcn-vue index.ts files
- Tauri v2 API compatibility (Store.load, window.setFullscreen)
- UnoCSS web fonts timeout in offline environments
- Storage page API errors with private Store constructor
- TypeScript errors with window.__TAURI__ detection

### Technical Details
- **Framework**: Nuxt 4.1.2 (upgraded from 3.19.2)
- **Desktop**: Tauri 2.2.0
- **UI Library**: shadcn-vue with Radix Vue primitives
- **Styling**: UnoCSS 66.0.0
- **Language**: TypeScript 5.8.2
- **Runtime**: Vue 3.5.13
- **Backend**: Rust with Tauri plugins (OS, Store, FS, Dialog, Notification)

### Security
- Permission-based API access via Tauri capabilities system
- Explicit allowlist for all native operations
- Rust backend for memory safety
- No Node.js runtime in renderer process

### Performance
- Bundle size: ~8MB (vs 100MB+ for Electron)
- Startup time: ~1.5 seconds
- Memory usage: ~65MB idle
- Build output optimized with Vite

---

## Version History

### [1.0.0] - 2025-10-03
- Initial public release with Nuxt 4 and Tauri 2

---

## Upgrade Notes

### Nuxt 3.19.2 → Nuxt 4.1.2
- Upgraded using `pnpm nuxt upgrade`
- No breaking changes required for this project
- All existing functionality preserved
- Improved performance and developer experience

### Future Upgrades
When upgrading dependencies:
```bash
# Check for updates
pnpm outdated

# Update Nuxt
pnpm nuxt upgrade

# Update all dependencies
pnpm update --latest

# Verify build
pnpm generate
pnpm tauri:build
```

---

**Note**: This project follows semantic versioning. Major version increments indicate breaking changes, minor versions add features, and patches fix bugs.
