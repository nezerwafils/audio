import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Post } from '../lib/types';
import { AudioPlayer, formatDuration, formatTimeAgo } from '../lib/utils/audio';
import { supabase } from '../lib/supabase/client';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onPress?: () => void;
  showFullDetails?: boolean;
}

export default function PostCard({
  post,
  currentUserId,
  isBookmarked,
  onToggleBookmark,
  onPress,
  showFullDetails = false,
}: PostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player] = useState(() => new AudioPlayer());
  
  // Initialize user reaction from post data
  const getUserReaction = () => {
    if (!currentUserId || !post.reactions) return null;
    const userReactionObj = post.reactions.find(r => r.user_id === currentUserId);
    return userReactionObj?.type || null;
  };
  
  const [userReaction, setUserReaction] = useState<string | null>(getUserReaction());

  const isOwnPost = currentUserId === post.user_id;

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await player.pause();
        setIsPlaying(false);
      } else {
        await player.loadAndPlay(post.audio_url);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const handleReaction = async (type: string) => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please set up your profile first');
      return;
    }

    try {
      if (userReaction === type) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId);
        setUserReaction(null);
      } else {
        // Add or update reaction
        await supabase
          .from('reactions')
          .upsert({
            post_id: post.id,
            user_id: currentUserId,
            type,
          });
        setUserReaction(type);
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.from('posts').delete().eq('id', post.id);
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const handleReport = () => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please set up your profile first');
      return;
    }

    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Spam',
          onPress: () => submitReport('spam'),
        },
        {
          text: 'Inappropriate',
          onPress: () => submitReport('inappropriate'),
        },
        {
          text: 'Harassment',
          onPress: () => submitReport('harassment'),
        },
      ]
    );
  };

  const submitReport = async (reason: string) => {
    try {
      await supabase.from('reports').insert({
        post_id: post.id,
        user_id: currentUserId,
        reason,
      });
      Alert.alert('Success', 'Report submitted. Thank you!');
    } catch (error) {
      console.error('Error reporting post:', error);
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {post.user?.avatar_url ? (
            <Image
              source={{ uri: post.user.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {post.user?.username?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.username}>{post.user?.username || 'Unknown'}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(post.created_at)}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          {isOwnPost ? (
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleReport} style={styles.actionButton}>
              <Text style={styles.reportButton}>⚠️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.audioPlayer} onPress={handlePlayPause}>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        </View>
        <View style={styles.audioInfo}>
          <Text style={styles.duration}>{formatDuration(post.duration)}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.reactions}>
          {['👍', '👎', '❤️', '🔥', '😂'].map((emoji, index) => {
            const types = ['like', 'dislike', 'love', 'fire', 'laugh'];
            const type = types[index];
            const count = post.reaction_counts?.[type as keyof typeof post.reaction_counts] || 0;
            const isActive = userReaction === type;

            return (
              <TouchableOpacity
                key={type}
                style={[styles.reactionButton, isActive && styles.reactionActive]}
                onPress={() => handleReaction(type)}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                {count > 0 && <Text style={styles.reactionCount}>{count}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        {onToggleBookmark && (
          <TouchableOpacity onPress={onToggleBookmark} style={styles.bookmarkButton}>
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '📚' : '📖'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
  },
  deleteButton: {
    fontSize: 20,
  },
  reportButton: {
    fontSize: 20,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    borderRadius: 30,
    padding: 8,
    marginBottom: 12,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
  },
  audioInfo: {
    flex: 1,
    marginLeft: 16,
  },
  duration: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactions: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  reactionActive: {
    backgroundColor: '#6c5ce7',
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookmarkButton: {
    padding: 6,
  },
  bookmarkIcon: {
    fontSize: 24,
  },
});
