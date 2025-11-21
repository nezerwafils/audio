import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  user: User | null;
  session: any;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
  signInAnonymously: () => Promise<void>;
  updateProfile: (username: string, avatarUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  setUser: (user) => set({ user }),
  
  setSession: (session) => set({ session }),

  initialize: async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        set({ session });
        // Fetch user profile
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          set({ user: userData, loading: false });
        } else if (!error || error.code === 'PGRST116') {
          // User doesn't exist in database yet
          set({ loading: false });
        } else {
          console.error('Error fetching user:', error);
          set({ loading: false });
        }
      } else {
        // No session, sign in anonymously
        await get().signInAnonymously();
      }
    } catch (error) {
      console.error('Error initializing:', error);
      set({ loading: false });
    }
  },

  signInAnonymously: async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      if (data.session) {
        set({ session: data.session });
        // Check if user profile exists
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (userData) {
          set({ user: userData, loading: false });
        } else {
          set({ loading: false });
        }
      }
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      set({ loading: false });
    }
  },

  updateProfile: async (username: string, avatarUrl?: string) => {
    const { session } = get();
    if (!session) throw new Error('No session');

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({ username, avatar_url: avatarUrl })
          .eq('id', session.user.id)
          .select()
          .single();

        if (error) throw error;
        set({ user: data });
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert([{ id: session.user.id, username, avatar_url: avatarUrl }])
          .select()
          .single();

        if (error) throw error;
        set({ user: data });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.clear();
      set({ user: null, session: null });
      // Sign in anonymously again
      await get().signInAnonymously();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
}));
