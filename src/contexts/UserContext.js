import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

const UserContext = createContext();

// Generate random username
const generateUsername = () => {
  const adjectives = ['Cool', 'Happy', 'Swift', 'Bright', 'Lucky', 'Brave', 'Wise', 'Kind', 'Bold', 'Pure'];
  const nouns = ['Voice', 'Sound', 'Echo', 'Wave', 'Beat', 'Tune', 'Vibe', 'Flow', 'Soul', 'Spirit'];
  const random = Math.floor(Math.random() * 1000);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${random}`;
};

// Generate random avatar
const generateAvatar = (username) => {
  // Using DiceBear API for random avatars
  const styles = ['avataaars', 'bottts', 'fun-emoji', 'pixel-art', 'identicon'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${username}`;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Check if user exists in AsyncStorage
      const storedUser = await AsyncStorage.getItem('currentUser');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Create a new anonymous user
        await createAnonymousUser();
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAnonymousUser = async () => {
    try {
      const username = generateUsername();
      const avatarUrl = generateAvatar(username);

      // Create user in Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, avatar_url: avatarUrl }])
        .select()
        .single();

      if (error) throw error;

      const newUser = {
        id: data.id,
        username: data.username,
        avatarUrl: data.avatar_url,
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Error creating anonymous user:', error);
      // Create offline user if Supabase fails
      const offlineUser = {
        id: `offline-${Date.now()}`,
        username: generateUsername(),
        avatarUrl: generateAvatar(username),
      };
      await AsyncStorage.setItem('currentUser', JSON.stringify(offlineUser));
      setUser(offlineUser);
    }
  };

  const updateUserProfile = async (username, avatarUrl) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({ username, avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = {
        ...user,
        username,
        avatarUrl,
      };

      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const resetUser = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      await createAnonymousUser();
    } catch (error) {
      console.error('Error resetting user:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUserProfile,
        resetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
