import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { AudioRecorder, uploadAudio, formatDuration } from '../lib/utils/audio';
import { supabase } from '../lib/supabase/client';
import { useUserStore } from '../lib/stores/userStore';

interface RecordButtonProps {
  onNeedProfile: () => void;
}

export default function RecordButton({ onNeedProfile }: RecordButtonProps) {
  const { user } = useUserStore();
  const [showRecorder, setShowRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recorder] = useState(() => new AudioRecorder());

  const handleStartRecording = async () => {
    if (!user) {
      onNeedProfile();
      return;
    }

    try {
      await recorder.startRecording();
      setIsRecording(true);
      setRecordDuration(0);

      // Update duration every second
      const interval = setInterval(() => {
        setRecordDuration(d => d + 1);
      }, 1000);

      // Store interval ID to clear later
      (recorder as any).durationInterval = interval;
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      clearInterval((recorder as any).durationInterval);
      const uri = await recorder.stopRecording();
      
      if (!uri) {
        throw new Error('No recording URI');
      }

      setIsRecording(false);
      setIsUploading(true);

      // Upload audio
      const audioUrl = await uploadAudio(uri, user!.id, 'post');
      
      // Create post
      await supabase.from('posts').insert({
        user_id: user!.id,
        audio_url: audioUrl,
        duration: recordDuration,
      });

      Alert.alert('Success', 'Post created successfully!');
      setShowRecorder(false);
      setRecordDuration(0);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      clearInterval((recorder as any).durationInterval);
      recorder.stopRecording();
      setIsRecording(false);
    }
    setShowRecorder(false);
    setRecordDuration(0);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowRecorder(true)}
      >
        <Text style={styles.fabIcon}>🎤</Text>
      </TouchableOpacity>

      <Modal
        visible={showRecorder}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Audio Post</Text>

            <View style={styles.recorderContainer}>
              {isRecording && (
                <>
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>Recording...</Text>
                  </View>
                  <Text style={styles.durationText}>
                    {formatDuration(recordDuration)}
                  </Text>
                </>
              )}

              {!isRecording && !isUploading && (
                <Text style={styles.instructionText}>
                  Tap the microphone to start recording
                </Text>
              )}

              {isUploading && (
                <Text style={styles.uploadingText}>Uploading...</Text>
              )}
            </View>

            <View style={styles.controls}>
              {!isRecording && !isUploading && (
                <>
                  <TouchableOpacity
                    style={styles.recordButton}
                    onPress={handleStartRecording}
                  >
                    <Text style={styles.recordButtonIcon}>🎤</Text>
                  </TouchableOpacity>
                </>
              )}

              {isRecording && (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={handleStopRecording}
                >
                  <Text style={styles.stopButtonIcon}>⏹️</Text>
                </TouchableOpacity>
              )}
            </View>

            {!isUploading && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  recorderContainer: {
    alignItems: 'center',
    marginBottom: 30,
    minHeight: 100,
    justifyContent: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e74c3c',
    marginRight: 8,
  },
  recordingText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  durationText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  instructionText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  uploadingText: {
    color: '#6c5ce7',
    fontSize: 18,
    fontWeight: '600',
  },
  controls: {
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonIcon: {
    fontSize: 40,
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonIcon: {
    fontSize: 40,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
});
