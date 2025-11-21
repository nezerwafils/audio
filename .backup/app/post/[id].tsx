import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePosts, useComments, useBookmarks } from '../../lib/hooks/usePosts';
import { useUserStore } from '../../lib/stores/userStore';
import PostCard from '../../components/PostCard';
import CommentCard from '../../components/CommentCard';
import AudioCommentRecorder from '../../components/AudioCommentRecorder';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUserStore();
  const { posts } = usePosts();
  const { comments } = useComments(id);
  const { bookmarkedPostIds, toggleBookmark } = useBookmarks(user?.id);
  const [showCommentRecorder, setShowCommentRecorder] = useState(false);

  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <PostCard
          post={post}
          currentUserId={user?.id}
          isBookmarked={bookmarkedPostIds.has(post.id)}
          onToggleBookmark={() => toggleBookmark(post.id)}
          showFullDetails
        />

        <View style={styles.commentsSection}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentsTitle}>
              Comments ({comments.length})
            </Text>
            {user && (
              <TouchableOpacity
                style={styles.addCommentButton}
                onPress={() => setShowCommentRecorder(true)}
              >
                <Text style={styles.addCommentText}>🎤 Add Comment</Text>
              </TouchableOpacity>
            )}
          </View>

          {comments.length === 0 ? (
            <View style={styles.emptyComments}>
              <Text style={styles.emptyText}>
                No comments yet. Be the first! 💬
              </Text>
            </View>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
              />
            ))
          )}
        </View>
      </ScrollView>

      {showCommentRecorder && (
        <AudioCommentRecorder
          postId={id}
          onClose={() => setShowCommentRecorder(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  commentsSection: {
    padding: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addCommentButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addCommentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyComments: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});
