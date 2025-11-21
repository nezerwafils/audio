# Changelog

All notable changes to AudioSocial will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-21

### Added - Initial Release

#### Core Features
- Audio-only social media platform
- Anonymous authentication with Supabase
- Simple profile setup (username + avatar)
- Audio post recording and playback
- Real-time feed updates
- 5 reaction types (Like, Dislike, Love, Fire, Laugh)
- Audio comments on posts
- Private bookmarks system
- Post deletion for creators
- Report system for moderation
- Settings page with privacy policy and terms

#### Screens
- Home feed with all posts
- Post detail with comments
- Profile setup and management
- Bookmarks collection
- Settings and legal information

#### Components
- PostCard - Audio post display with reactions
- CommentCard - Audio comment display
- RecordButton - Floating action button
- AudioCommentRecorder - Modal for recording comments
- SetupProfileModal - First-time profile creation

#### Backend
- Complete PostgreSQL schema
- Row Level Security policies
- Supabase Storage integration
- Real-time subscriptions
- Anonymous authentication

#### Documentation
- README with setup instructions
- SETUP.md for quick start
- FEATURES.md with detailed feature list
- CONTRIBUTING.md for developers
- ARCHITECTURE.md for system design
- Supabase setup guide

### Technical Stack
- React Native 0.72.6
- Expo SDK 49
- TypeScript
- Supabase (PostgreSQL + Storage + Auth + Realtime)
- Zustand for state management
- Expo Router for navigation
- Expo AV for audio

### Database Schema
- users table (minimal profile data)
- posts table (audio posts)
- reactions table (5 types)
- comments table (audio comments)
- bookmarks table (private saves)
- reports table (moderation)

### Security
- Row Level Security on all tables
- Anonymous authentication
- Minimal data collection
- Private bookmarks
- User-scoped operations

### Performance
- Indexed database queries
- Real-time subscriptions
- Optimized audio playback
- Efficient storage usage

## [Unreleased]

### Planned Features
- [ ] Push notifications
- [ ] Following/followers system
- [ ] User profiles with post history
- [ ] Audio effects and filters
- [ ] Hashtags and categories
- [ ] Search functionality
- [ ] Audio transcription
- [ ] Direct messages
- [ ] Enhanced moderation tools
- [ ] Analytics dashboard

### Under Consideration
- [ ] Multiple audio quality options
- [ ] Offline mode
- [ ] Audio trimming/editing
- [ ] Post scheduling
- [ ] Verified users badges
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Export/import data
- [ ] Podcast-style long-form posts
- [ ] Live audio rooms

---

## Version History

### Version Numbering
- **Major** (X.0.0): Breaking changes or major rewrites
- **Minor** (1.X.0): New features, backward compatible
- **Patch** (1.0.X): Bug fixes, backward compatible

### Release Schedule
- Major releases: As needed for significant changes
- Minor releases: Monthly (feature additions)
- Patch releases: Weekly or as needed (bug fixes)

### Migration Guides
When upgrading between major versions, see the migration guide in the release notes.

---

## Links
- [Repository](https://github.com/nezerwafils/audio)
- [Issues](https://github.com/nezerwafils/audio/issues)
- [Discussions](https://github.com/nezerwafils/audio/discussions)
