import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { useUser } from '../contexts/UserContext';

export default function RecordScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      clearInterval(timerRef.current);
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const stopPlaying = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const discardRecording = () => {
    setRecordingUri(null);
    setRecordingDuration(0);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  const uploadRecording = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please restart the app.');
      return;
    }

    setUploading(true);

    try {
      // Read file as blob
      const response = await fetch(recordingUri);
      const blob = await response.blob();

      // Upload to Supabase storage
      const fileName = `audio_${Date.now()}_${Math.random().toString(36).substring(7)}.m4a`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, blob, {
          contentType: 'audio/m4a',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(fileName);

      // Create post in database
      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            audio_url: publicUrl,
            duration: recordingDuration,
          },
        ]);

      if (postError) throw postError;

      Alert.alert('Success', 'Audio posted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            discardRecording();
            navigation.navigate('Feed');
          },
        },
      ]);
    } catch (error) {
      console.error('Error uploading:', error);
      Alert.alert('Error', 'Failed to upload audio. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!recordingUri ? (
          // Recording Mode
          <>
            <View style={styles.visualizer}>
              <Ionicons
                name={isRecording ? 'mic' : 'mic-outline'}
                size={100}
                color={isRecording ? '#EF4444' : '#8B5CF6'}
              />
              {isRecording && (
                <View style={styles.recordingIndicator}>
                  <View style={styles.redDot} />
                  <Text style={styles.recordingText}>Recording...</Text>
                </View>
              )}
            </View>

            <Text style={styles.durationText}>
              {formatDuration(recordingDuration)}
            </Text>

            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons
                name={isRecording ? 'stop' : 'mic'}
                size={40}
                color="white"
              />
            </TouchableOpacity>
          </>
        ) : (
          // Preview Mode
          <>
            <View style={styles.visualizer}>
              <Ionicons
                name={isPlaying ? 'volume-high' : 'checkmark-circle'}
                size={100}
                color="#10B981"
              />
            </View>

            <Text style={styles.durationText}>
              {formatDuration(recordingDuration)}
            </Text>

            <View style={styles.previewControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={isPlaying ? stopPlaying : playRecording}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={30}
                  color="#8B5CF6"
                />
                <Text style={styles.controlText}>
                  {isPlaying ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={discardRecording}
              >
                <Ionicons name="trash" size={30} color="#EF4444" />
                <Text style={styles.controlText}>Discard</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
              onPress={uploadRecording}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={24} color="white" />
                  <Text style={styles.uploadButtonText}>Post Audio</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  visualizer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  durationText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
    padding: 16,
  },
  controlText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
