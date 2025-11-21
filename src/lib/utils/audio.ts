// Web Audio utilities
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'just now';
}

export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private onEndCallback?: () => void;

  async loadAndPlay(url: string, onEnd?: () => void) {
    if (this.audio) {
      this.audio.pause();
    }

    this.audio = new Audio(url);
    this.onEndCallback = onEnd;

    if (onEnd) {
      this.audio.onended = onEnd;
    }

    try {
      await this.audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  async pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  async stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  setOnTimeUpdate(callback: (time: number) => void) {
    if (this.audio) {
      this.audio.ontimeupdate = () => callback(this.audio!.currentTime);
    }
  }
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private durationInterval: NodeJS.Timeout | null = null;

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }

        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  setDurationInterval(interval: NodeJS.Timeout) {
    this.durationInterval = interval;
  }

  clearDurationInterval() {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }
}

export async function uploadAudio(blob: Blob, userId: string): Promise<string> {
  const { supabase } = await import('../supabase/client');
  const fileName = `${userId}/${Date.now()}.webm`;

  const { data, error } = await supabase.storage
    .from('audio')
    .upload(fileName, blob, {
      contentType: 'audio/webm',
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('audio')
    .getPublicUrl(fileName);

  return publicUrl;
}
