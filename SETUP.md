# 🚀 Quick Setup Guide

Follow these steps to get Audio Social running on your machine.

## Step 1: Install Prerequisites

1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (v14+)
2. **Expo CLI**: Install globally
   ```bash
   npm install -g expo-cli
   ```

## Step 2: Clone and Install

```bash
git clone https://github.com/nezerwafils/audio.git
cd audio
npm install
```

## Step 3: Setup Supabase

### 3.1 Create Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Fill in project details:
   - Name: `audio-social`
   - Database Password: (save this!)
   - Region: (choose closest to you)

### 3.2 Get API Credentials
1. Once project is created, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3.3 Configure Environment
1. Create `.env` file in project root:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and add your credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Setup Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Reactions table
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies (Allow all for anonymous access)
CREATE POLICY "Allow all users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all posts" ON posts FOR ALL USING (true);
CREATE POLICY "Allow all likes" ON likes FOR ALL USING (true);
CREATE POLICY "Allow all reactions" ON reactions FOR ALL USING (true);
CREATE POLICY "Allow all comments" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all bookmarks" ON bookmarks FOR ALL USING (true);
CREATE POLICY "Allow all reports" ON reports FOR ALL USING (true);
```

4. Click **Run** to execute

## Step 5: Setup Storage

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Bucket name: `audio`
4. Make it **Public**: Toggle "Public bucket" ON
5. Click **Create bucket**

### 5.1 Add Storage Policies
1. Click on the `audio` bucket
2. Go to **Policies** tab
3. Click **New Policy** → **Create a policy from scratch**
4. Add three policies:

**Policy 1: Allow Uploads**
- Policy name: `Allow public audio uploads`
- Target roles: `public`
- Operations: `INSERT`
- Click **Review** → **Save policy**

**Policy 2: Allow Access**
- Policy name: `Allow public audio access`
- Target roles: `public`
- Operations: `SELECT`
- Click **Review** → **Save policy**

**Policy 3: Allow Deletes**
- Policy name: `Allow users to delete their audio`
- Target roles: `public`
- Operations: `DELETE`
- Click **Review** → **Save policy**

## Step 6: Run the App

```bash
npm start
```

This will open Expo DevTools in your browser.

### To test on:
- **Phone**: Download "Expo Go" app, scan QR code
- **iOS Simulator**: Press `i` in terminal (macOS only)
- **Android Emulator**: Press `a` in terminal
- **Web Browser**: Press `w` in terminal

## ✅ Verify Installation

1. App should load without errors
2. You should see a random username and avatar in Profile tab
3. Try recording an audio in the Record tab
4. Post should appear in Feed tab

## 🐛 Troubleshooting

### "Supabase error"
- Double-check your `.env` file has correct credentials
- Ensure there are no extra spaces in the values
- Restart the app: `Ctrl+C` then `npm start`

### "Audio not recording"
- Grant microphone permissions when prompted
- On iOS simulator, audio recording may not work
- Test on a real device

### "Posts not showing"
- Check Supabase Dashboard → Table Editor → posts table
- Verify database policies are created correctly
- Check browser console for errors

## 🎉 Success!

You're all set! Start exploring Audio Social and share your voice!

---

Need help? Open an issue on [GitHub](https://github.com/nezerwafils/audio/issues)
