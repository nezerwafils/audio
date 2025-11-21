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

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    loadPosts();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (username, avatar_url),
          likes (id, is_like),
          reactions (id, reaction_type),
          comments (id),
          bookmarks (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process posts to add counts and user interactions
      const processedPosts = data.map(post => ({
        ...post,
        username: post.users?.username || 'Anonymous',
        avatarUrl: post.users?.avatar_url,
        likesCount: post.likes?.filter(l => l.is_like).length || 0,
        dislikesCount: post.likes?.filter(l => !l.is_like).length || 0,
        userLike: post.likes?.find(l => l.user_id === user?.id)?.is_like,
        reactionsCount: post.reactions?.length || 0,
        userReaction: post.reactions?.find(r => r.user_id === user?.id)?.reaction_type,
        commentsCount: post.comments?.length || 0,
        isBookmarked: post.bookmarks?.some(b => b.user_id === user?.id) || false,
      }));

      setPosts(processedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <AudioPost
            post={item}
            currentUserId={user?.id}
            onDelete={handleDelete}
            onUpdate={loadPosts}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share an audio!</Text>
          </View>
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : null}
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
  },
});
