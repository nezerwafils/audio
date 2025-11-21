import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Post, Comment } from '../types';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(*),
          reactions(type, user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process posts with reaction counts
      const processedPosts = data?.map(post => {
        const reactionCounts = {
          like: 0,
          dislike: 0,
          love: 0,
          fire: 0,
          laugh: 0,
        };

        post.reactions?.forEach((r: { type: string; user_id: string }) => {
          const reactionType = r.type as keyof typeof reactionCounts;
          if (reactionType in reactionCounts) {
            reactionCounts[reactionType]++;
          }
        });

        return {
          ...post,
          reaction_counts: reactionCounts,
        };
      }) || [];

      setPosts(processedPosts);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { posts, loading, error, refetch: fetchPosts };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:users(*)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`comments_${postId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  return { comments, loading, refetch: fetchComments };
}

export function useBookmarks(userId: string | undefined) {
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', userId);

      if (error) throw error;
      
      const ids = new Set(data?.map(b => b.post_id) || []);
      setBookmarkedPostIds(ids);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [userId]);

  const toggleBookmark = async (postId: string) => {
    if (!userId) return;

    const isBookmarked = bookmarkedPostIds.has(postId);

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        setBookmarkedPostIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: userId, post_id: postId });

        setBookmarkedPostIds(prev => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return { bookmarkedPostIds, toggleBookmark, loading };
}
