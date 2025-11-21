# 🔧 Troubleshooting Guide

Common issues and solutions for Audio Social app.

## Installation Issues

### 1. `npm install` fails

**Problem**: Dependency installation errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### 2. Expo CLI not found

**Problem**: `expo: command not found`

**Solution**:
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Or use npx
npx expo start
```

## Supabase Issues

### 3. "Failed to fetch" or Supabase connection errors

**Problem**: Can't connect to Supabase

**Checklist**:
- ✅ Check `.env` file exists and has correct values
- ✅ Verify `EXPO_PUBLIC_SUPABASE_URL` is correct (should start with `https://`)
- ✅ Verify `EXPO_PUBLIC_SUPABASE_ANON_KEY` is the anon/public key (not service_role)
- ✅ Restart the app after changing `.env`

**Test connection**:
```javascript
// Add to App.js temporarily
import { supabase } from './src/services/supabase';

supabase.from('users').select('*').limit(1)
  .then(({ data, error }) => {
    console.log('Supabase test:', { data, error });
  });
```

### 4. Database policies not working

**Problem**: Can't read/write to database

**Solution**:
1. Go to Supabase Dashboard → Authentication → Policies
2. Ensure each table has policies enabled
3. Verify policies allow public access (for anonymous users)
4. Re-run the policy creation SQL from SETUP.md

### 5. Storage bucket errors

**Problem**: Can't upload audio files

**Checklist**:
- ✅ Bucket named `audio` exists
- ✅ Bucket is set to **Public**
- ✅ Storage policies are created
- ✅ Check Supabase Dashboard → Storage → Policies

**Fix**:
1. Delete and recreate the `audio` bucket
2. Make it public
3. Re-add storage policies from SETUP.md

## Audio Recording Issues

### 6. Microphone permission denied

**Problem**: Can't record audio

**iOS Solution**:
1. Go to Settings → Privacy → Microphone
2. Enable for Expo Go or your app
3. Restart the app

**Android Solution**:
1. Go to Settings → Apps → Expo Go (or your app)
2. Permissions → Microphone → Allow
3. Restart the app

### 7. Audio recording not working on iOS Simulator

**Problem**: Recording fails on simulator

**Reason**: iOS Simulator doesn't support audio input

**Solution**: Test on a real device using Expo Go app

### 8. Audio playback issues

**Problem**: Can't play recorded audio

**Checklist**:
- ✅ Check audio file uploaded to Supabase Storage
- ✅ Verify public URL is accessible (open in browser)
- ✅ Check console for playback errors
- ✅ Ensure audio permissions are granted

## App Behavior Issues

### 9. Posts not appearing in feed

**Problem**: Feed is empty after posting

**Debug Steps**:
1. Check Supabase Dashboard → Table Editor → posts
2. Verify post was created with correct data
3. Check browser/Expo console for errors
4. Try pulling down to refresh the feed

**Common Causes**:
- Database query error
- Real-time subscription not working
- User ID mismatch

### 10. User not created / stuck loading

**Problem**: App stays on loading screen

**Solution**:
```bash
# Clear app storage
# iOS: Settings → Expo Go → Reset
# Android: Settings → Apps → Expo Go → Clear Storage

# Or reset in code
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.clear();
```

### 11. Bookmarks not showing

**Problem**: Bookmarked posts don't appear

**Check**:
1. User ID is correct
2. Bookmarks table has entries (Supabase Dashboard)
3. Join query is working correctly

**Fix**: Check console for SQL errors and verify foreign keys

### 12. Can't delete posts

**Problem**: Delete button doesn't work

**Verify**:
- User ID matches post's user_id
- Delete policy exists in Supabase
- No foreign key constraint errors

## Performance Issues

### 13. App is slow or laggy

**Optimizations**:
```bash
# Clear Expo cache
expo start -c

# Rebuild the app
rm -rf .expo node_modules
npm install
```

### 14. Audio takes long to load

**Causes**:
- Large audio files
- Slow internet connection
- Supabase storage in different region

**Solutions**:
- Reduce recording quality in RecordScreen.js
- Use Supabase CDN (automatic)
- Choose closer Supabase region

## Build Issues

### 15. Metro bundler errors

**Problem**: JavaScript bundle failed to build

**Solution**:
```bash
# Start with clean cache
expo start -c

# Or manually clear
rm -rf .metro-health-check* node_modules/.cache
```

### 16. Module resolution errors

**Problem**: Can't find module '@supabase/supabase-js'

**Fix**:
```bash
# Ensure all dependencies are installed
npm install

# Check package.json has all required deps
npm ls
```

## Platform-Specific Issues

### 17. Android: Network request failed

**Problem**: HTTP/HTTPS requests fail

**Solution**: Add network permissions to `app.json`:
```json
{
  "expo": {
    "android": {
      "usesCleartextTraffic": true
    }
  }
}
```

### 18. iOS: App crashes on launch

**Problem**: Immediate crash on iOS

**Check**:
- Xcode logs for errors
- Ensure all required permissions in app.json
- Verify iOS deployment target compatibility

### 19. Web: Can't access camera/microphone

**Problem**: Web browser blocks media access

**Solution**:
- Use HTTPS (Expo provides this automatically)
- Click "Allow" when browser prompts
- Check browser's site settings

## Development Issues

### 20. Hot reload not working

**Problem**: Changes don't reflect in app

**Solution**:
```bash
# Restart with cache clear
expo start -c

# Or shake device → Reload
# Or press 'r' in terminal
```

### 21. Environment variables not loading

**Problem**: .env values are undefined

**Checklist**:
- ✅ File is named exactly `.env` (not `.env.txt`)
- ✅ Variables start with `EXPO_PUBLIC_`
- ✅ No spaces around `=` sign
- ✅ Restart expo after changing .env

**Example**:
```
# ✅ Correct
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# ❌ Wrong
SUPABASE_URL = https://xxx.supabase.co
```

## Getting More Help

### Check Logs

**Expo/Metro logs**: Terminal where you ran `npm start`

**Device logs**:
- iOS: Open Xcode → Window → Devices and Simulators
- Android: `adb logcat`

**Supabase logs**: Dashboard → Logs

### Debug Mode

Enable verbose logging:
```javascript
// Add to App.js
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('User:', user);
```

### Still Stuck?

1. Check [Expo documentation](https://docs.expo.dev/)
2. Check [Supabase documentation](https://supabase.com/docs)
3. Search [Stack Overflow](https://stackoverflow.com/)
4. Open an issue on [GitHub](https://github.com/nezerwafils/audio/issues)

### Provide This Info When Asking for Help:

- Operating System (Windows/Mac/Linux)
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Expo SDK version (check package.json)
- Error message (full stack trace)
- Steps to reproduce the issue

---

**Most issues are solved by**:
1. Clearing cache (`expo start -c`)
2. Reinstalling dependencies
3. Checking .env configuration
4. Verifying Supabase setup

Good luck! 🎵
