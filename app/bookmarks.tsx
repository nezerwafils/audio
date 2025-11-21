import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../lib/stores/userStore';
import { usePosts, useBookmarks } from '../lib/hooks/usePosts';
import PostCard from '../components/PostCard';
import { useRouter } from 'expo-router';

export default function BookmarksScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { posts } = usePosts();
  const { bookmarkedPostIds, toggleBookmark } = useBookmarks(user?.id);

  const bookmarkedPosts = posts.filter(post => bookmarkedPostIds.has(post.id));

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id}
            isBookmarked={true}
            onToggleBookmark={() => toggleBookmark(item.id)}
            onPress={() => router.push(`/post/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No bookmarks yet. Save posts you love! 📚
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
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
