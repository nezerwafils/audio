# Contributing to AudioSocial

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Git
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Supabase account

### Getting Started

1. **Fork and Clone**
```bash
git clone https://github.com/YOUR_USERNAME/audio.git
cd audio
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Supabase**
Follow instructions in `SETUP.md`

4. **Configure Environment**
```bash
cp .env.example .env
# Add your Supabase credentials
```

5. **Start Development Server**
```bash
npm start
```

## Project Structure

```
/audio
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root navigation layout
│   ├── index.tsx          # Home feed
│   ├── profile.tsx        # Profile management
│   ├── settings.tsx       # Settings screen
│   ├── bookmarks.tsx      # Bookmarks list
│   └── post/
│       └── [id].tsx       # Post detail with comments
├── components/            # Reusable React components
│   ├── PostCard.tsx       # Audio post display
│   ├── CommentCard.tsx    # Comment display
│   ├── RecordButton.tsx   # Main recording FAB
│   ├── AudioCommentRecorder.tsx
│   └── SetupProfileModal.tsx
├── lib/                   # Core functionality
│   ├── supabase/         # Supabase client
│   ├── stores/           # Zustand state management
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
├── supabase/             # Database schema & docs
├── assets/               # App icons and images
└── ...config files
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to hooks
- Use proper TypeScript props typing

### Naming Conventions
- Components: PascalCase (e.g., `PostCard.tsx`)
- Files: camelCase or kebab-case
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces/Types: PascalCase

### Example Component
```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export default function MyComponent({ title, onPress }: MyComponentProps) {
  const [state, setState] = useState('');
  
  // Component logic here
  
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // styles
  },
});
```

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Changes
- Write clean, documented code
- Follow existing patterns
- Add types for TypeScript
- Test your changes thoroughly

### 3. Test
```bash
# Test on iOS
npm run ios

# Test on Android
npm run android

# Test on Web
npm run web
```

### 4. Commit
```bash
git add .
git commit -m "feat: add new feature"
```

Use conventional commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and PR
```bash
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub.

## Testing Guidelines

### Manual Testing Checklist
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on real device (if possible)
- [ ] Test with slow network
- [ ] Test audio recording
- [ ] Test audio playback
- [ ] Test error scenarios
- [ ] Test with no profile set up
- [ ] Test with profile set up

### Edge Cases to Test
- Network failure during upload
- Microphone permission denied
- Storage permission issues
- Invalid audio files
- Very long recordings
- Multiple rapid interactions
- Deleting while playing

## Adding New Features

### 1. Plan
- Discuss in GitHub Issues first
- Consider impact on existing features
- Think about edge cases
- Design the user experience

### 2. Implement
- Start with types and interfaces
- Build the UI components
- Add business logic
- Connect to Supabase if needed
- Handle errors gracefully

### 3. Document
- Update README if needed
- Add JSDoc comments
- Update FEATURES.md
- Add to CHANGELOG

### 4. Review
- Self-review your code
- Check for console errors
- Verify TypeScript types
- Test all scenarios

## Working with Supabase

### Database Changes
1. Update `supabase/schema.sql`
2. Run SQL in Supabase dashboard
3. Update TypeScript types in `lib/types/`
4. Update affected queries and hooks

### Storage Changes
1. Document in `supabase/README.md`
2. Update storage policies if needed
3. Update upload/download logic

### Realtime Changes
1. Test subscription setup/cleanup
2. Handle connection errors
3. Consider performance impact

## Common Tasks

### Adding a New Screen
1. Create file in `app/` directory
2. Add navigation in `app/_layout.tsx` if needed
3. Create component in `components/` if reusable
4. Add types in `lib/types/` if needed

### Adding a New Component
1. Create in `components/` directory
2. Define TypeScript props interface
3. Add proper styling
4. Export as default

### Adding a New Hook
1. Create in `lib/hooks/` directory
2. Follow React hooks rules
3. Add TypeScript types
4. Handle cleanup properly

### Modifying Database Schema
1. Update `supabase/schema.sql`
2. Run in Supabase SQL Editor
3. Update TypeScript types
4. Update affected queries
5. Test thoroughly

## Performance Considerations

### Audio
- Use appropriate audio quality settings
- Consider file size limits
- Implement proper cleanup
- Handle memory properly

### Images
- Use appropriate image sizes
- Implement lazy loading
- Cache when possible
- Optimize for mobile

### Database
- Use indexes properly
- Implement pagination
- Avoid N+1 queries
- Use select to limit fields

### UI
- Avoid unnecessary re-renders
- Use React.memo when appropriate
- Implement proper loading states
- Consider list virtualization

## Debugging Tips

### React Native Debugger
```bash
# Install
npm install -g react-devtools

# Run
react-devtools
```

### Logs
```typescript
console.log('Debug:', data);
console.error('Error:', error);
```

### Expo Dev Tools
- Shake device for menu
- Toggle performance monitor
- Check network requests

### Supabase Logs
- Check dashboard logs
- Monitor realtime events
- Review storage logs

## Getting Help

- **Documentation**: Check README, SETUP, FEATURES
- **Issues**: Search existing GitHub Issues
- **Discussions**: Start a GitHub Discussion
- **Code**: Read existing implementations

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows style guide
- [ ] TypeScript types are correct
- [ ] No console errors
- [ ] Tested on multiple platforms
- [ ] Documentation updated
- [ ] Commit messages are clear

### PR Description Should Include
- What changes were made
- Why the changes were needed
- How to test the changes
- Screenshots/videos if UI change
- Breaking changes if any

### Review Process
1. Automated checks run
2. Maintainer reviews code
3. Discussion and feedback
4. Revisions if needed
5. Merge when approved

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue with the `question` label or start a discussion!
