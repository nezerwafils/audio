# 🤝 Contributing to Audio Social

Thank you for your interest in contributing to Audio Social! This document provides guidelines and instructions for contributing.

## 🌟 How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs if applicable
   - Environment details (OS, device, versions)

### Suggesting Features

1. **Check roadmap** and existing feature requests
2. **Describe the feature** clearly:
   - Problem it solves
   - Proposed solution
   - Alternative approaches
   - Impact on users

### Code Contributions

#### Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/your-username/audio.git
   cd audio
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials
   - Follow SETUP.md

#### Making Changes

1. **Write clean code**
   - Follow existing code style
   - Use meaningful variable names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Test your changes**
   - Test on iOS and Android if possible
   - Verify no regressions
   - Check console for errors
   - Test edge cases

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add audio filters"
   # or
   git commit -m "fix: resolve playback issue"
   ```

#### Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add voice effects to recordings
fix: resolve audio playback on Android
docs: update setup instructions
style: format code with prettier
refactor: simplify user context logic
```

#### Pull Request Process

1. **Update documentation** if needed
2. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request** on GitHub
   - Use clear title and description
   - Reference related issues
   - Add screenshots/videos for UI changes
   - List breaking changes if any

4. **Respond to reviews**
   - Address feedback promptly
   - Make requested changes
   - Keep discussion professional

5. **Wait for approval**
   - At least one maintainer review required
   - CI checks must pass
   - No merge conflicts

## 📋 Development Guidelines

### Code Style

- **JavaScript**: Use ES6+ features
- **Formatting**: Consistent indentation (2 spaces)
- **Naming**:
  - Components: PascalCase (`AudioPost.js`)
  - Functions: camelCase (`handleLike`)
  - Constants: UPPER_SNAKE_CASE (`MAX_DURATION`)

### Component Structure

```javascript
// Imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Component
export default function MyComponent({ prop1, prop2 }) {
  // State
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // effect logic
  }, []);

  // Handlers
  const handleAction = () => {
    // handler logic
  };

  // Render
  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    // styles
  },
});
```

### Best Practices

1. **Performance**
   - Use `useCallback` and `useMemo` appropriately
   - Optimize FlatList rendering
   - Avoid unnecessary re-renders

2. **Error Handling**
   - Always catch errors
   - Provide user-friendly messages
   - Log errors for debugging

3. **Accessibility**
   - Add accessibility labels
   - Support screen readers
   - Ensure good contrast ratios

4. **Security**
   - Validate user input
   - Sanitize data before storage
   - Don't expose sensitive keys

## 🎨 Design Guidelines

### UI/UX Principles

- **Consistency**: Match existing design patterns
- **Simplicity**: Keep interfaces clean and intuitive
- **Feedback**: Provide visual feedback for actions
- **Accessibility**: Design for all users

### Color Palette

- Primary: `#8B5CF6` (Purple)
- Success: `#10B981` (Green)
- Danger: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)
- Gray: `#666666`, `#999999`, `#E5E5E5`

### Typography

- Headers: Bold, 20-24px
- Body: Regular, 14-16px
- Captions: Regular, 12-14px

## 🧪 Testing

### Manual Testing Checklist

- [ ] Test on iOS (real device or simulator)
- [ ] Test on Android (real device or emulator)
- [ ] Test with slow network
- [ ] Test offline behavior
- [ ] Test edge cases (empty states, errors)
- [ ] Test accessibility features

### Areas to Test

1. **Recording**
   - Start/stop recording
   - Playback preview
   - Upload to Supabase
   - Permission handling

2. **Feed**
   - Load posts
   - Play audio
   - Like/dislike
   - Reactions
   - Bookmarks
   - Pull to refresh

3. **Profile**
   - Edit username
   - Change avatar
   - View settings
   - Reset profile

4. **Bookmarks**
   - Add/remove bookmarks
   - View saved posts
   - Navigate to post details

## 🔍 Code Review

### What We Look For

- ✅ Code quality and readability
- ✅ Follows project conventions
- ✅ No unnecessary complexity
- ✅ Proper error handling
- ✅ Performance considerations
- ✅ Documentation updates
- ✅ No security issues

### Review Timeline

- Initial review: 1-3 days
- Follow-up reviews: 1-2 days
- Final approval: 1 day

## 📚 Resources

### Documentation

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)

### Tools

- [Expo Snack](https://snack.expo.dev/) - Online playground
- [React DevTools](https://react-devtools-experimental.vercel.app/)
- [Flipper](https://fbflipper.com/) - Debugging

## 🎯 Priority Areas

Currently seeking help with:

1. **Audio Comments** - Implement voice replies
2. **Following System** - User connections
3. **Search** - Find posts and users
4. **Notifications** - Push notification system
5. **Testing** - Unit and integration tests
6. **Documentation** - API docs, tutorials
7. **Localization** - Multi-language support

## 💬 Communication

- **Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Pull Requests**: For code changes

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing private information

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Thank You!

Every contribution, no matter how small, helps make Audio Social better. We appreciate your time and effort!

---

**Questions?** Open an issue or start a discussion.

**Ready to contribute?** Pick an issue labeled `good first issue` or `help wanted`.
