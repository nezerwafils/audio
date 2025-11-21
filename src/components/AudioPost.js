import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👏'];

export default function AudioPost({ post, currentUserId, onDelete, onUpdate }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    return () => {
      // Cleanup sound on unmount
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const togglePlay = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: post.audio_url },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleLike = async (isLike) => {
    try {
      // Check if user already liked/disliked
      if (post.userLike === isLike) {
        // Remove like/dislike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId);
      } else {
        // Upsert like/dislike
        await supabase
          .from('likes')
          .upsert({
            post_id: post.id,
            user_id: currentUserId,
            is_like: isLike,
          });
      }
      onUpdate();
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleReaction = async (reaction) => {
    try {
      if (post.userReaction === reaction) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId);
      } else {
        // Upsert reaction
        await supabase
          .from('reactions')
          .upsert({
            post_id: post.id,
            user_id: currentUserId,
            reaction_type: reaction,
          });
      }
      setShowReactions(false);
      onUpdate();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      if (post.isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId);
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            post_id: post.id,
            user_id: currentUserId,
          });
      }
      onUpdate();
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for reporting');
      return;
    }

    try {
      await supabase
        .from('reports')
        .insert({
          post_id: post.id,
          reporter_id: currentUserId,
          reason: reportReason,
        });

      Alert.alert('Success', 'Post reported successfully');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error('Error reporting post:', error);
      Alert.alert('Error', 'Failed to report post');
    }
  };

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(post.id),
        },
      ]
    );
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOwnPost = post.user_id === currentUserId;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: post.avatarUrl }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </View>
        {isOwnPost ? (
          <TouchableOpacity onPress={handleDeletePost}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowReportModal(true)}>
            <Ionicons name="flag-outline" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Audio Player */}
      <View style={styles.playerContainer}>
        <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={32}
            color="white"
          />
        </TouchableOpacity>
        <View style={styles.waveform}>
          <Text style={styles.duration}>{formatDuration(post.duration)}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(true)}
        >
          <Ionicons
            name={post.userLike === true ? 'heart' : 'heart-outline'}
            size={24}
            color={post.userLike === true ? '#EF4444' : '#666'}
          />
          <Text style={styles.actionText}>{post.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(false)}
        >
          <Ionicons
            name={post.userLike === false ? 'heart-dislike' : 'heart-dislike-outline'}
            size={24}
            color={post.userLike === false ? '#3B82F6' : '#666'}
          />
          <Text style={styles.actionText}>{post.dislikesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowReactions(!showReactions)}
        >
          <Text style={styles.reactionEmoji}>
            {post.userReaction || '😊'}
          </Text>
          <Text style={styles.actionText}>{post.reactionsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBookmark}
        >
          <Ionicons
            name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={post.isBookmarked ? '#8B5CF6' : '#666'}
          />
        </TouchableOpacity>
      </View>

      {/* Reactions Picker */}
      {showReactions && (
        <View style={styles.reactionsPicker}>
          {REACTIONS.map((reaction) => (
            <TouchableOpacity
              key={reaction}
              onPress={() => handleReaction(reaction)}
              style={[
                styles.reactionButton,
                post.userReaction === reaction && styles.reactionButtonActive,
              ]}
            >
              <Text style={styles.reactionText}>{reaction}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Post</Text>
            <TextInput
              style={styles.reportInput}
              placeholder="Why are you reporting this post?"
              value={reportReason}
              onChangeText={setReportReason}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.reportButton]}
                onPress={handleReport}
              >
                <Text style={styles.reportButtonText}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e5e5',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    flex: 1,
    marginLeft: 12,
    height: 48,
    justifyContent: 'center',
  },
  duration: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  reactionEmoji: {
    fontSize: 24,
  },
  reactionsPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  reactionButton: {
    padding: 8,
  },
  reactionButtonActive: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
  },
  reactionText: {
    fontSize: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#e5e5e5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  reportButton: {
    backgroundColor: '#EF4444',
  },
  reportButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
