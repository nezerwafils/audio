export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  audio_url: string;
  duration: number;
  created_at: string;
  user?: User;
  reactions?: Reaction[];
  comments?: Comment[];
  is_bookmarked?: boolean;
  reaction_counts?: {
    like: number;
    dislike: number;
    love: number;
    fire: number;
    laugh: number;
  };
  user_reaction?: string | null;
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  type: 'like' | 'dislike' | 'love' | 'fire' | 'laugh';
  created_at: string;
  user?: User;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  audio_url: string;
  duration: number;
  created_at: string;
  user?: User;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  post_id: string;
  user_id: string;
  reason: string;
  created_at: string;
}
