# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Supabase

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details and wait for setup to complete

### Run the Database Schema
1. In your Supabase dashboard, go to the SQL Editor
2. Create a new query
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click "Run"

### Set Up Storage
1. Go to Storage in the sidebar
2. Click "Create a new bucket"
3. Name it `audio-files`
4. Make it public:
   - Click on the bucket
   - Go to Policies
   - Click "New Policy"
   - Use the SQL from `supabase/README.md`

### Get Your API Keys
1. Go to Settings → API
2. Copy your Project URL
3. Copy your anon/public key

## 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Start the App
```bash
npm start
```

Then:
- Press `w` for web
- Press `a` for Android
- Press `i` for iOS
- Or scan the QR code with Expo Go app

## Testing the App

1. **First Launch**: App will create an anonymous user
2. **Set Username**: Tap "Setup Profile" to choose a username
3. **Create Post**: Tap the 🎤 button to record and post
4. **React**: Tap reaction emojis on posts
5. **Comment**: Open a post and tap "Add Comment"
6. **Bookmark**: Tap the bookmark icon
7. **Settings**: Access privacy policy and terms

## Troubleshooting

### "Supabase connection error"
- Check your `.env` file has correct credentials
- Verify the Supabase project is active
- Check internet connection

### "Recording permission denied"
- On iOS: Settings → AudioSocial → Microphone → Enable
- On Android: Grant permission when prompted

### "Storage upload failed"
- Verify storage bucket `audio-files` exists
- Check bucket is public
- Verify storage policies are set up correctly

### Database errors
- Make sure you ran the full schema from `supabase/schema.sql`
- Check Row Level Security policies are enabled
- Verify tables are created correctly

## Need Help?

Open an issue on GitHub with:
- Description of the problem
- Error messages (if any)
- Platform (iOS/Android/Web)
- Steps to reproduce
