import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../services/supabase';
import { useUser } from '../contexts/UserContext';
import AudioPost from '../components/AudioPost';

export default function BookmarksScreen() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          post_id,
          posts (
            *,
            users (username, avatar_url),
            likes (id, is_like),
            reactions (id, reaction_type),
            comments (id),
            bookmarks (id)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process posts
      const processedPosts = data
        .filter(item => item.posts) // Filter out null posts
        .map(item => {
          const post = item.posts;
          return {
            ...post,
            username: post.users?.username || 'Anonymous',
            avatarUrl: post.users?.avatar_url,
            likesCount: post.likes?.filter(l => l.is_like).length || 0,
            dislikesCount: post.likes?.filter(l => !l.is_like).length || 0,
            userLike: post.likes?.find(l => l.user_id === user?.id)?.is_like,
            reactionsCount: post.reactions?.length || 0,
            userReaction: post.reactions?.find(r => r.user_id === user?.id)?.reaction_type,
            commentsCount: post.comments?.length || 0,
            isBookmarked: true,
          };
        });

      setBookmarkedPosts(processedPosts);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookmarks();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setBookmarkedPosts(bookmarkedPosts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading bookmarks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedPosts}
        renderItem={({ item }) => (
          <AudioPost
            post={item}
            currentUserId={user?.id}
            onDelete={handleDelete}
            onUpdate={loadBookmarks}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookmarks yet</Text>
            <Text style={styles.emptySubtext}>
              Bookmark posts to listen to them later
            </Text>
          </View>
        }
        contentContainerStyle={bookmarkedPosts.length === 0 ? styles.emptyList : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
