# AudioSocial - Audio-Only Social Media App

An innovative audio-only social media platform where users share their voice through audio posts, reactions, and comments. No signup required - just open the app and start listening!

## 🎤 Features

- **Audio Posts**: Record and share audio posts with the community
- **No Signup Required**: Start using the app immediately with anonymous authentication
- **Simple Profile Setup**: Just choose a username and optional avatar
- **Reactions**: Express yourself with likes, dislikes, love, fire, and laugh reactions
- **Audio Comments**: Reply to posts with voice comments instead of text
- **Bookmarks**: Save your favorite posts for later
- **Post Management**: Delete your own posts anytime
- **Report System**: Help keep the community safe by reporting inappropriate content
- **Real-time Updates**: See new posts and reactions as they happen
- **Privacy Focused**: Minimal data collection, your bookmarks are private

## 🏗️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Storage + Real-time)
- **Audio**: Expo AV
- **State Management**: Zustand
- **Navigation**: Expo Router

## 📱 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- Supabase account (free tier works great!)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nezerwafils/audio.git
cd audio
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in your SQL Editor
   - Create a storage bucket named `audio-files` and make it public
   - See `supabase/README.md` for detailed instructions

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

5. Start the development server:
```bash
npm start
```

6. Run on your device:
   - Install Expo Go on your iOS or Android device
   - Scan the QR code from the terminal
   - Or press `a` for Android emulator or `i` for iOS simulator

## 🗄️ Database Schema

The app uses the following main tables:
- **users**: User profiles (username, avatar)
- **posts**: Audio posts
- **reactions**: Likes/dislikes/reactions on posts
- **comments**: Audio comments on posts
- **bookmarks**: Saved posts per user
- **reports**: User-submitted reports for moderation

See `supabase/schema.sql` for the complete schema with Row Level Security policies.

## 🎨 App Structure

```
/app                 # Expo Router screens
  /_layout.tsx       # Root layout with navigation
  /index.tsx         # Home feed
  /profile.tsx       # Profile management
  /settings.tsx      # Settings, privacy, terms
  /bookmarks.tsx     # Bookmarked posts
  /post/[id].tsx     # Post detail with comments

/components          # Reusable components
  /PostCard.tsx      # Audio post component
  /CommentCard.tsx   # Audio comment component
  /RecordButton.tsx  # Floating record button
  /AudioCommentRecorder.tsx
  /SetupProfileModal.tsx

/lib                 # Core functionality
  /supabase/         # Supabase client
  /stores/           # Zustand stores
  /hooks/            # Custom React hooks
  /types/            # TypeScript types
  /utils/            # Utilities (audio, formatting)
```

## 🔒 Privacy & Security

- **Anonymous by Default**: No email or phone number required
- **Minimal Data**: Only username and optional avatar
- **Private Bookmarks**: Only you can see what you've saved
- **User Control**: Delete your posts anytime
- **Community Moderation**: Report system for inappropriate content
- **Row Level Security**: Database policies ensure data protection

## 📄 Legal

- Privacy Policy: Available in Settings
- Terms of Use: Available in Settings
- Community Guidelines: Available in Settings

## 🤝 Contributing

This is an open-source project! Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Development Notes

- **Audio Recording**: Uses Expo AV for high-quality audio recording
- **Real-time Updates**: Supabase real-time subscriptions for live feed updates
- **Storage**: Audio files stored in Supabase Storage
- **Authentication**: Supabase anonymous auth for seamless onboarding

## 🚀 Deployment

### iOS
1. Configure your Apple Developer account in Expo
2. Run `expo build:ios`
3. Submit to App Store

### Android
1. Configure your Google Play account in Expo
2. Run `expo build:android`
3. Submit to Google Play

## 🐛 Known Issues & Roadmap

- [ ] Add push notifications for reactions and comments
- [ ] Implement following/followers system
- [ ] Add user profiles with post history
- [ ] Support for audio editing (trim, effects)
- [ ] Add hashtags and search functionality
- [ ] Implement audio transcription for accessibility

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 📜 License

MIT License - feel free to use this project for your own purposes!

---

Built with ❤️ by the audio community