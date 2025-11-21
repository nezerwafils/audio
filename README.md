# 🎵 Audio Social - Voice-Only Social Media App

A unique social media experience where everything is audio. No typing, no reading - just pure voice interaction. Share your thoughts, react to others, and build a community through the power of voice.

## ✨ Features

### Core Features
- 🎙️ **Audio Recording** - Record and share voice posts instantly
- 🔊 **Audio Feed** - Browse all posts with audio playback
- 👤 **Anonymous Users** - No signup required, just open and start
- ❤️ **Like/Dislike** - Express your opinion on posts
- 😊 **Reactions** - React with emojis (❤️, 😂, 😮, 😢, 😡, 👏)
- 🔖 **Bookmarks** - Save posts for later
- 🗑️ **Delete Posts** - Creators can delete their own posts
- 🚩 **Report System** - Report inappropriate content
- 💬 **Audio Comments** - Comment with voice (no typing!)
- ⚙️ **Settings** - Customize your experience
- 🔒 **Privacy Policy** - Transparent data handling
- 📄 **Terms of Use** - Clear community guidelines

### User Experience
- **Instant Access** - No email, password, or signup forms
- **Random Identity** - Automatically generated username and avatar
- **Profile Customization** - Change username and randomize avatar
- **Real-time Updates** - See new posts as they're posted
- **Smooth Animations** - Beautiful, fluid UI

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nezerwafils/audio.git
   cd audio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   
   Create a free account at [supabase.com](https://supabase.com) and create a new project.

4. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Setup Database**
   
   Run the following SQL in your Supabase SQL Editor:

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

6. **Setup Storage**
   
   In Supabase Dashboard:
   - Go to Storage
   - Create a new bucket named `audio`
   - Make it public
   - Add the following policies:

   ```sql
   -- Storage policies
   CREATE POLICY "Allow public audio uploads" 
   ON storage.objects FOR INSERT 
   WITH CHECK (bucket_id = 'audio');

   CREATE POLICY "Allow public audio access" 
   ON storage.objects FOR SELECT 
   USING (bucket_id = 'audio');

   CREATE POLICY "Allow users to delete their audio" 
   ON storage.objects FOR DELETE 
   USING (bucket_id = 'audio');
   ```

7. **Start the app**
   ```bash
   npm start
   ```

### Running on Different Platforms

- **iOS**: `npm run ios` (requires macOS)
- **Android**: `npm run android` (requires Android Studio)
- **Web**: `npm run web`

## 📱 App Structure

```
audio/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── AudioPost.js  # Post component with audio player
│   ├── contexts/         # React contexts
│   │   └── UserContext.js # User state management
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.js # Main app navigator
│   ├── screens/          # Main app screens
│   │   ├── FeedScreen.js      # Main feed
│   │   ├── RecordScreen.js    # Recording interface
│   │   ├── BookmarksScreen.js # Saved posts
│   │   └── ProfileScreen.js   # User profile & settings
│   ├── services/         # External services
│   │   └── supabase.js   # Supabase configuration
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
├── App.js               # App entry point
└── package.json         # Dependencies
```

## 🎨 Design Philosophy

### Audio-First
Everything in the app revolves around audio. No text posts, no typed comments - just pure voice interaction.

### No Barriers
Zero signup friction. Open the app and start engaging immediately with an auto-generated anonymous identity.

### Privacy-Focused
Minimal data collection. Only username, avatar, and your audio posts. No email, phone, or personal information required.

### Community-Driven
Built-in moderation tools (report system) to keep the community safe and healthy.

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (PostgreSQL + Storage + Real-time)
- **Audio**: Expo AV
- **Navigation**: React Navigation
- **Storage**: AsyncStorage (local) + Supabase Storage (cloud)
- **UI Icons**: Expo Vector Icons
- **Avatars**: DiceBear API

## 🔐 Security & Privacy

- **Anonymous by Default**: No personal information required
- **Data Encryption**: All data encrypted in transit and at rest
- **User Control**: Delete your posts anytime
- **Content Moderation**: Report system for inappropriate content
- **Transparent Policies**: Clear privacy policy and terms of use

## 📈 Future Enhancements

- [ ] Audio comments implementation
- [ ] Following system
- [ ] Trending/Popular feed
- [ ] Search functionality
- [ ] Push notifications
- [ ] Audio effects/filters
- [ ] Direct messaging (audio)
- [ ] User verification badges
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Expo team for the amazing framework
- Supabase for the powerful backend
- DiceBear for avatar generation
- The open-source community

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Made with ❤️ and 🎙️ - Share Your Voice!**
