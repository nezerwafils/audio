import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../supabase/client';

export class AudioRecorder {
  private recording: Audio.Recording | null = null;

  async startRecording(): Promise<void> {
    try {
      const permission = await Audio.requestPermissionsAsync();
      
      if (!permission.granted) {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recording) return null;

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async getDuration(): Promise<number> {
    if (!this.recording) return 0;
    
    const status = await this.recording.getStatusAsync();
    return status.durationMillis ? Math.floor(status.durationMillis / 1000) : 0;
  }

  isRecording(): boolean {
    return this.recording !== null;
  }
}

export class AudioPlayer {
  private sound: Audio.Sound | null = null;

  async loadAndPlay(uri: string): Promise<void> {
    try {
      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      this.sound = sound;

      // Auto unload when playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.unload();
        }
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
    }
  }

  async resume(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
    }
  }

  async unload(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export async function uploadAudio(
  uri: string,
  userId: string,
  type: 'post' | 'comment' = 'post'
): Promise<string> {
  try {
    const fileExt = 'mp3';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    // Read file as base64
    const fileData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const blob = base64ToBlob(fileData, 'audio/mpeg');

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(filePath, blob, {
        contentType: 'audio/mpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload audio:', error);
    throw error;
  }
}

function base64ToBlob(base64: string, type: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
