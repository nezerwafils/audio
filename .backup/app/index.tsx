import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../lib/stores/userStore';
import { usePosts } from '../lib/hooks/usePosts';
import { useBookmarks } from '../lib/hooks/usePosts';
import PostCard from '../components/PostCard';
import RecordButton from '../components/RecordButton';
import SetupProfileModal from '../components/SetupProfileModal';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { posts, loading, refetch } = usePosts();
  const { bookmarkedPostIds, toggleBookmark } = useBookmarks(user?.id);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const handleCreatePost = () => {
    if (!user) {
      setShowSetupModal(true);
      return;
    }
    // RecordButton will handle the actual recording
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/bookmarks')}
        >
          <Text style={styles.headerButtonText}>📚 Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            if (!user) {
              setShowSetupModal(true);
            } else {
              router.push('/profile');
            }
          }}
        >
          <Text style={styles.headerButtonText}>
            {user ? `👤 ${user.username}` : '👤 Setup Profile'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.headerButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id}
            isBookmarked={bookmarkedPostIds.has(item.id)}
            onToggleBookmark={() => toggleBookmark(item.id)}
            onPress={() => router.push(`/post/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor="#6c5ce7"
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No posts yet. Be the first to share! 🎤
            </Text>
          </View>
        }
      />

      <RecordButton onNeedProfile={() => setShowSetupModal(true)} />

      <SetupProfileModal
        visible={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});
