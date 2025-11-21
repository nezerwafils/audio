import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function SettingsScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              AudioSocial is an audio-only social media platform where you can
              share your voice with the world. Record audio posts, react,
              comment (with audio), and discover content from others.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => openLink('https://github.com/nezerwafils/audio')}
          >
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => openLink('https://github.com/nezerwafils/audio')}
          >
            <Text style={styles.menuItemText}>Terms of Use</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              • Your username and avatar are public{'\n'}
              • Your audio posts are public{'\n'}
              • Your reactions and comments are public{'\n'}
              • Your bookmarks are private{'\n'}
              • You can delete your posts at any time{'\n'}
              • Report inappropriate content
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Guidelines</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              • Be respectful to others{'\n'}
              • No hate speech or harassment{'\n'}
              • No explicit or inappropriate content{'\n'}
              • No spam or misleading content{'\n'}
              • Report violations using the report feature
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c5ce7',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
  },
  infoLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
  },
  menuItemArrow: {
    color: '#6c5ce7',
    fontSize: 20,
  },
});
