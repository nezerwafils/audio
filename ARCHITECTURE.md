# AudioSocial Architecture

## System Overview

AudioSocial is a mobile-first social media application built with a modern, scalable architecture. The system is designed for audio-only content sharing with real-time interactions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         React Native + Expo                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │   iOS    │  │ Android  │  │   Web    │     │   │
│  │  └──────────┘  └──────────┘  └──────────┘     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ├─── HTTP/WebSocket ───┐
                          │                       │
┌─────────────────────────▼───────────────────────▼───────┐
│                   Supabase Backend                       │
│  ┌─────────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │ PostgreSQL  │  │ Storage  │  │  Auth & RT      │   │
│  │  Database   │  │  (Audio) │  │  Subscriptions  │   │
│  └─────────────┘  └──────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React Native (0.72.6)
- **Platform**: Expo (SDK 49)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **State Management**: Zustand
- **Audio**: Expo AV
- **Styling**: React Native StyleSheet

### Backend (Supabase)
- **Database**: PostgreSQL 15
- **Storage**: S3-compatible object storage
- **Auth**: Supabase Auth (anonymous)
- **Realtime**: WebSocket subscriptions
- **API**: Auto-generated REST API

## Component Architecture

### Layered Architecture

```
┌───────────────────────────────────────┐
│        Presentation Layer             │
│    (Screens & Components)             │
├───────────────────────────────────────┤
│         Business Logic Layer          │
│       (Hooks & Stores)                │
├───────────────────────────────────────┤
│         Data Access Layer             │
│      (Supabase Client)                │
├───────────────────────────────────────┤
│          Utilities Layer              │
│     (Audio, Formatting, etc.)         │
└───────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── _layout (Navigation Container)
│   ├── index (Home Feed)
│   │   ├── PostCard (List Item)
│   │   │   └── AudioPlayer
│   │   └── RecordButton (FAB)
│   │       └── AudioRecorder
│   ├── post/[id] (Post Detail)
│   │   ├── PostCard
│   │   ├── CommentCard (List)
│   │   └── AudioCommentRecorder
│   ├── profile (Profile Edit)
│   ├── bookmarks (Saved Posts)
│   └── settings (App Settings)
└── Modals
    └── SetupProfileModal
```

## Data Flow

### State Management Strategy

**Global State (Zustand)**
- User session
- User profile
- Authentication state

**Local State (useState)**
- Component UI state
- Form inputs
- Temporary data

**Server State (Supabase + Hooks)**
- Posts (via usePosts)
- Comments (via useComments)
- Bookmarks (via useBookmarks)
- Real-time subscriptions

### Data Flow Example: Creating a Post

```
User Action (Record Audio)
    ↓
RecordButton Component
    ↓
AudioRecorder.startRecording()
    ↓
User stops recording
    ↓
AudioRecorder.stopRecording() → returns URI
    ↓
uploadAudio(uri) → Supabase Storage
    ↓
Returns public URL
    ↓
supabase.from('posts').insert() → Database
    ↓
Realtime subscription triggers
    ↓
usePosts hook refetches
    ↓
Feed updates with new post
```

## Database Design

### Entity Relationship Diagram

```
┌──────────┐         ┌──────────┐
│  Users   │────────<│  Posts   │
└──────────┘         └──────────┘
     │                    │
     │                    │
     ├────────<  ┌────────┼────────┐
     │           │        │        │
     │      ┌────▼──┐ ┌───▼────┐ ┌▼────────┐
     │      │React. │ │Comments│ │Reports  │
     │      └───────┘ └────────┘ └─────────┘
     │
     └────────< ┌──────────┐
                │Bookmarks │
                └──────────┘
```

### Key Design Decisions

**Users Table**
- Minimal data collection (username, avatar only)
- ID comes from Supabase Auth
- No email, phone, or PII

**Posts Table**
- Audio URL stored as string (Supabase Storage)
- Duration stored for UI display
- Foreign key to users with cascade delete

**Reactions Table**
- Unique constraint on (post_id, user_id)
- User can only have one reaction per post
- Can be updated or deleted

**Comments Table**
- Similar to posts but linked to parent post
- Audio-based, no text
- Cascade deletes with post

**Bookmarks Table**
- Private user data
- Unique constraint prevents duplicates
- Cascade deletes with user or post

**Reports Table**
- Stores moderation reports
- No automatic action (manual review)
- Multiple reports per post allowed

## Security Architecture

### Row Level Security (RLS)

**Policy Strategy**
- Enable RLS on all tables
- Public read access for most data
- Write access only for authenticated users
- Delete access only for resource owners

**Example: Posts Table Policies**
```sql
-- Anyone can view posts
CREATE POLICY "public_read" ON posts
FOR SELECT USING (true);

-- Users can create their own posts
CREATE POLICY "user_create" ON posts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "user_delete" ON posts
FOR DELETE USING (auth.uid() = user_id);
```

### Storage Security

**Bucket Policies**
- Public read access (CDN delivery)
- Authenticated write access
- User-scoped deletion (own files only)

## Performance Optimization

### Database Optimizations
- Indexes on frequently queried columns
- Composite indexes for common joins
- Created_at indexed for feed ordering
- Foreign keys for referential integrity

### Client Optimizations
- React.memo for expensive components
- Lazy loading for routes
- Audio streaming (not full download)
- Image caching
- Subscription cleanup

### Network Optimizations
- Supabase CDN for storage
- WebSocket for realtime (not polling)
- Batch operations where possible
- Optimistic UI updates

## Scalability Considerations

### Current Limits
- Supabase Free Tier: 500MB database, 1GB storage
- Expo: Development only (need build for production)
- Storage: Audio files limited by Supabase quota

### Scaling Strategy

**Vertical Scaling (Easy)**
- Upgrade Supabase tier
- Larger database instance
- More storage capacity

**Horizontal Scaling (Future)**
- CDN for static assets
- Edge functions for compute
- Read replicas for database
- Sharding by region

### Monitoring & Analytics
- Supabase dashboard metrics
- Expo analytics (optional)
- Custom event tracking
- Error reporting (Sentry, etc.)

## Real-time Architecture

### WebSocket Connections

```
Client subscribes to channel
    ↓
Supabase establishes WebSocket
    ↓
Database change occurs (INSERT/UPDATE/DELETE)
    ↓
PostgreSQL triggers notification
    ↓
Supabase broadcasts to subscribed clients
    ↓
Client receives update
    ↓
React hook updates state
    ↓
UI re-renders with new data
```

### Subscription Management
- Subscribe on component mount
- Unsubscribe on unmount
- Channel per resource type
- Filters for scoped updates

## Audio Architecture

### Recording Pipeline

```
User Permission Request
    ↓
Expo AV Permission Check
    ↓
Set Audio Mode (Recording)
    ↓
Start Recording Session
    ↓
Capture Audio Input
    ↓
Stop Recording
    ↓
Save to Local Filesystem
    ↓
Return File URI
```

### Upload Pipeline

```
Local File URI
    ↓
Read as Base64
    ↓
Convert to Blob
    ↓
Upload to Supabase Storage
    ↓
Return Public URL
    ↓
Store in Database
```

### Playback Pipeline

```
Get Audio URL from Post
    ↓
Create Sound Object (Expo AV)
    ↓
Load Audio from URL
    ↓
Start Playback
    ↓
Monitor Status
    ↓
Cleanup on Complete
```

## Deployment Architecture

### Development
```
Local Machine
    ↓
Expo Dev Server
    ↓
Expo Go App (Device)
    ↓
Supabase (Cloud)
```

### Production
```
Build Server (EAS Build)
    ↓
Compile Native App
    ↓
App Stores (iOS/Android)
    ↓
User Device
    ↓
Supabase (Cloud)
```

## Error Handling Strategy

### Layered Error Handling

**Component Level**
- Try-catch for async operations
- User-friendly error messages
- Graceful degradation

**Service Level**
- Retry logic for network failures
- Timeout handling
- Fallback values

**Global Level**
- Error boundary components
- Crash reporting
- Logging service

## Future Architecture Considerations

### Planned Enhancements
1. **Microservices**: Separate auth, storage, processing
2. **Message Queue**: For async processing (transcription)
3. **Cache Layer**: Redis for hot data
4. **Search Engine**: Elasticsearch for full-text search
5. **Analytics Pipeline**: Data warehouse for insights

### Migration Path
- Keep current architecture for MVP
- Gradual extraction of services
- Maintain backward compatibility
- Zero-downtime deployments

## Conclusion

This architecture provides:
- ✅ Simple development experience
- ✅ Scalable infrastructure
- ✅ Secure data handling
- ✅ Real-time capabilities
- ✅ Cross-platform support
- ✅ Easy maintenance
- ✅ Cost-effective (free tier)

The design allows for future growth while maintaining simplicity for current needs.
