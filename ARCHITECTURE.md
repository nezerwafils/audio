# 🏗️ Architecture Overview

Understanding the structure and design of Audio Social.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Mobile App                            │
│                   (React Native + Expo)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Feed       │  │   Record     │  │  Bookmarks   │      │
│  │   Screen     │  │   Screen     │  │   Screen     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Profile    │  │  AudioPost   │  │    User      │      │
│  │   Screen     │  │  Component   │  │   Context    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            PostgreSQL Database                       │   │
│  │  - users     - posts      - likes                    │   │
│  │  - reactions - comments   - bookmarks                │   │
│  │  - reports                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Storage (Audio Files)                     │   │
│  │  - Public bucket for audio files                     │   │
│  │  - CDN for fast delivery                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Real-time Subscriptions                   │   │
│  │  - Live feed updates                                 │   │
│  │  - New post notifications                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Component Architecture

### Navigation Layer

```
App.js
  └─ UserProvider (Context)
      └─ AppNavigator (Tab Navigator)
          ├─ FeedScreen
          ├─ RecordScreen
          ├─ BookmarksScreen
          └─ ProfileScreen
```

### Data Flow

```
User Action → Screen Component → Supabase Service → Database/Storage
                    ↓                                       ↓
                Context                              Real-time Update
                    ↓                                       ↓
                Re-render ← ─────────────────────────────────
```

## 📦 Project Structure

```
audio/
├── src/
│   ├── components/           # Reusable UI components
│   │   └── AudioPost.js     # Post card with audio player
│   │
│   ├── contexts/            # React contexts for state
│   │   └── UserContext.js   # Anonymous user management
│   │
│   ├── navigation/          # App navigation
│   │   └── AppNavigator.js  # Bottom tab navigator
│   │
│   ├── screens/             # Main app screens
│   │   ├── FeedScreen.js         # Browse all posts
│   │   ├── RecordScreen.js       # Create audio posts
│   │   ├── BookmarksScreen.js    # Saved posts
│   │   └── ProfileScreen.js      # User settings
│   │
│   └── services/            # External service integrations
│       └── supabase.js      # Supabase client & schema
│
├── assets/                  # Images, icons, fonts
├── App.js                   # Root component
├── package.json             # Dependencies
└── app.json                 # Expo configuration
```

## 🗄️ Database Schema

### Tables

**users**
```sql
id          UUID PRIMARY KEY
username    TEXT UNIQUE NOT NULL
avatar_url  TEXT
created_at  TIMESTAMP
```

**posts**
```sql
id          UUID PRIMARY KEY
user_id     UUID FOREIGN KEY → users(id)
audio_url   TEXT NOT NULL
duration    INTEGER NOT NULL
created_at  TIMESTAMP
```

**likes**
```sql
id          UUID PRIMARY KEY
post_id     UUID FOREIGN KEY → posts(id)
user_id     UUID FOREIGN KEY → users(id)
is_like     BOOLEAN NOT NULL
created_at  TIMESTAMP
UNIQUE(post_id, user_id)
```

**reactions**
```sql
id              UUID PRIMARY KEY
post_id         UUID FOREIGN KEY → posts(id)
user_id         UUID FOREIGN KEY → users(id)
reaction_type   TEXT NOT NULL
created_at      TIMESTAMP
UNIQUE(post_id, user_id)
```

**bookmarks**
```sql
id          UUID PRIMARY KEY
post_id     UUID FOREIGN KEY → posts(id)
user_id     UUID FOREIGN KEY → users(id)
created_at  TIMESTAMP
UNIQUE(post_id, user_id)
```

**comments**
```sql
id          UUID PRIMARY KEY
post_id     UUID FOREIGN KEY → posts(id)
user_id     UUID FOREIGN KEY → users(id)
audio_url   TEXT NOT NULL
duration    INTEGER NOT NULL
created_at  TIMESTAMP
```

**reports**
```sql
id              UUID PRIMARY KEY
post_id         UUID FOREIGN KEY → posts(id)
reporter_id     UUID FOREIGN KEY → users(id)
reason          TEXT NOT NULL
created_at      TIMESTAMP
```

### Relationships

```
users ─────┬──→ posts (one-to-many)
           ├──→ likes (one-to-many)
           ├──→ reactions (one-to-many)
           ├──→ bookmarks (one-to-many)
           ├──→ comments (one-to-many)
           └──→ reports (one-to-many)

posts ─────┬──→ likes (one-to-many)
           ├──→ reactions (one-to-many)
           ├──→ bookmarks (one-to-many)
           ├──→ comments (one-to-many)
           └──→ reports (one-to-many)
```

## 🔄 State Management

### User Context

**Purpose**: Manage anonymous user identity across the app

**State**:
- `user`: Current user object (id, username, avatarUrl)
- `loading`: Initial load state

**Methods**:
- `updateUserProfile()`: Update username/avatar
- `resetUser()`: Create new anonymous identity

**Persistence**: AsyncStorage (local device storage)

### Local Component State

Each screen manages its own state:
- **FeedScreen**: posts, loading, refreshing
- **RecordScreen**: recording, sound, uploading
- **BookmarksScreen**: bookmarkedPosts, loading
- **ProfileScreen**: modals, edit states

## 🎵 Audio Flow

### Recording Process

```
1. User taps record button
   ↓
2. Request microphone permission
   ↓
3. Start Audio.Recording
   ↓
4. Display recording UI with timer
   ↓
5. User stops recording
   ↓
6. Save recording URI locally
   ↓
7. Preview playback
   ↓
8. User confirms upload
   ↓
9. Upload to Supabase Storage
   ↓
10. Get public URL
   ↓
11. Create post in database
   ↓
12. Navigate to Feed
```

### Playback Process

```
1. User taps play on post
   ↓
2. Create Audio.Sound from URL
   ↓
3. Set playback status listener
   ↓
4. Start playback
   ↓
5. Update UI (play/pause button)
   ↓
6. Listen for completion
   ↓
7. Reset UI when finished
   ↓
8. Cleanup on unmount
```

## 🔐 Security Model

### Anonymous Authentication

- No passwords or credentials
- Device-based identity via AsyncStorage
- User can reset identity anytime

### Data Access (Row Level Security)

```sql
-- Public access policies for anonymous users
CREATE POLICY "Allow all" ON table_name 
FOR ALL USING (true);
```

### Privacy Considerations

1. **Minimal Data**: Only username, avatar, audio
2. **Anonymous Files**: Random file names (no user ID)
3. **Local Storage**: User identity stored on device
4. **No Tracking**: No analytics or tracking pixels

## 📡 Real-time Updates

### Supabase Subscriptions

```javascript
// Subscribe to new posts
supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => {
      // Reload feed
    }
  )
  .subscribe();
```

### Events Listened To

- **INSERT**: New post created
- **UPDATE**: Post modified
- **DELETE**: Post removed

## 🚀 Performance Optimizations

### Frontend

1. **FlatList**: Efficient list rendering with virtualization
2. **Image Caching**: Avatar images cached automatically
3. **Sound Management**: Proper cleanup prevents memory leaks
4. **Optimistic Updates**: UI updates before server confirms

### Backend

1. **CDN**: Supabase uses CDN for audio file delivery
2. **Indexes**: Database indexes on frequently queried fields
3. **Connection Pooling**: Efficient database connections
4. **Edge Functions**: Supabase edge locations worldwide

## 🔌 API Integration

### Supabase Client

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(URL, ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
```

### Common Operations

**Fetch Posts**:
```javascript
const { data } = await supabase
  .from('posts')
  .select('*, users(username, avatar_url)')
  .order('created_at', { ascending: false });
```

**Upload Audio**:
```javascript
const { data } = await supabase.storage
  .from('audio')
  .upload(fileName, blob);
```

**Create Post**:
```javascript
const { data } = await supabase
  .from('posts')
  .insert({ user_id, audio_url, duration });
```

## 🎨 UI/UX Patterns

### Design System

**Colors**:
- Primary: Purple (#8B5CF6)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Neutral: Grays

**Spacing**: 4px, 8px, 12px, 16px, 20px, 24px

**Border Radius**: 8px, 12px, 20px, 50% (circular)

### Interaction Patterns

1. **Pull to Refresh**: Standard iOS/Android pattern
2. **Tap to Play**: Single tap for audio playback
3. **Long Press**: Future feature for additional options
4. **Swipe**: Standard navigation gestures

## 🧪 Testing Strategy

### Manual Testing

- Test on iOS and Android devices
- Test with/without network
- Test permission flows
- Test edge cases (empty states, errors)

### Areas to Cover

1. User creation and persistence
2. Audio recording and playback
3. Post creation and display
4. Interactions (like, bookmark, etc.)
5. Profile editing
6. Real-time updates

## 📈 Scalability

### Current Capacity

- **Users**: Unlimited (anonymous)
- **Posts**: Limited by Supabase plan
- **Storage**: 1GB free tier, upgradeable

### Growth Considerations

1. **Database**: Partition large tables
2. **Storage**: CDN handles scaling
3. **Real-time**: Supabase auto-scales
4. **Costs**: Pay-as-you-grow pricing

## 🔮 Future Enhancements

### Planned Features

1. **Audio Comments**: Voice replies to posts
2. **Following System**: User connections
3. **Trending**: Popular posts algorithm
4. **Search**: Find posts and users
5. **Notifications**: Push notifications
6. **Audio Effects**: Filters and enhancements

### Architecture Changes

- **Caching Layer**: Redis for hot data
- **Analytics**: Usage tracking (privacy-friendly)
- **Moderation Queue**: Review reported content
- **Content Delivery**: Dedicated audio CDN

---

**Built with ❤️ using React Native, Expo, and Supabase**
