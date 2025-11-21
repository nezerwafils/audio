import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';

export default function ProfileScreen() {
  const { user, updateUserProfile, resetUser } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(editUsername, user.avatarUrl);
      Alert.alert('Success', 'Profile updated successfully');
      setShowEditModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleResetUser = () => {
    Alert.alert(
      'Reset Profile',
      'This will create a new anonymous profile. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetUser,
        },
      ]
    );
  };

  const handleChangeAvatar = () => {
    // Generate new random avatar
    const styles = ['avataaars', 'bottts', 'fun-emoji', 'pixel-art', 'identicon'];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const newAvatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${Date.now()}`;
    updateUserProfile(user.username, newAvatarUrl);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleChangeAvatar}>
          <Image
            source={{ uri: user?.avatarUrl }}
            style={styles.profileImage}
          />
          <View style={styles.editAvatarBadge}>
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.username}>{user?.username}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Ionicons name="create-outline" size={20} color="#8B5CF6" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowSettingsModal(true)}
        >
          <Ionicons name="settings-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowPrivacyModal(true)}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowTermsModal(true)}
        >
          <Ionicons name="document-text-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Terms of Use</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleResetUser}
        >
          <Ionicons name="refresh-outline" size={24} color="#EF4444" />
          <Text style={[styles.menuText, styles.dangerText]}>Reset Profile</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Audio Social v1.0.0</Text>
        <Text style={styles.infoSubtext}>
          Share your voice with the world 🎵
        </Text>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editUsername}
              onChangeText={setEditUsername}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>App Version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Audio Quality</Text>
              <Text style={styles.settingValue}>High</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettingsModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContentScroll}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <Text style={styles.policyText}>
                <Text style={styles.bold}>Last updated: {new Date().toLocaleDateString()}</Text>
                {'\n\n'}
                <Text style={styles.bold}>1. Information We Collect</Text>
                {'\n'}
                We collect minimal information:
                {'\n'}- Anonymous username (randomly generated)
                {'\n'}- Profile picture (avatar)
                {'\n'}- Audio recordings you post
                {'\n'}- Interactions (likes, reactions, bookmarks)
                {'\n\n'}
                <Text style={styles.bold}>2. How We Use Your Information</Text>
                {'\n'}
                Your information is used solely to:
                {'\n'}- Display your posts in the feed
                {'\n'}- Enable social interactions
                {'\n'}- Improve the app experience
                {'\n\n'}
                <Text style={styles.bold}>3. Data Storage</Text>
                {'\n'}
                All data is stored securely on Supabase servers with encryption.
                {'\n\n'}
                <Text style={styles.bold}>4. Your Rights</Text>
                {'\n'}
                You can:
                {'\n'}- Delete your posts anytime
                {'\n'}- Reset your profile
                {'\n'}- Report inappropriate content
                {'\n\n'}
                <Text style={styles.bold}>5. Contact</Text>
                {'\n'}
                For privacy concerns, contact us through the app.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPrivacyModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContentScroll}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Terms of Use</Text>
              <Text style={styles.policyText}>
                <Text style={styles.bold}>Last updated: {new Date().toLocaleDateString()}</Text>
                {'\n\n'}
                <Text style={styles.bold}>1. Acceptance of Terms</Text>
                {'\n'}
                By using Audio Social, you agree to these terms.
                {'\n\n'}
                <Text style={styles.bold}>2. User Conduct</Text>
                {'\n'}
                You agree NOT to:
                {'\n'}- Post harmful, offensive, or illegal content
                {'\n'}- Harass or bully other users
                {'\n'}- Spam or abuse the platform
                {'\n'}- Violate intellectual property rights
                {'\n\n'}
                <Text style={styles.bold}>3. Content Ownership</Text>
                {'\n'}
                You retain ownership of your audio recordings. By posting, you grant us a license to display and distribute your content within the app.
                {'\n\n'}
                <Text style={styles.bold}>4. Content Moderation</Text>
                {'\n'}
                We reserve the right to remove any content that violates these terms.
                {'\n\n'}
                <Text style={styles.bold}>5. Disclaimer</Text>
                {'\n'}
                The app is provided "as is" without warranties. We are not responsible for user-generated content.
                {'\n\n'}
                <Text style={styles.bold}>6. Changes to Terms</Text>
                {'\n'}
                We may update these terms. Continued use constitutes acceptance of changes.
                {'\n\n'}
                <Text style={styles.bold}>7. Termination</Text>
                {'\n'}
                We may terminate access for violations of these terms.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e5e5e5',
  },
  editAvatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#8B5CF6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  editButtonText: {
    marginLeft: 8,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dangerText: {
    color: '#EF4444',
  },
  infoSection: {
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalContentScroll: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#e5e5e5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#999',
  },
  closeButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  policyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});
