// screens/EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api'; // centralized API

const COLORS = {
  primaryBlue: '#4A90E2',
  lightTeal: '#DDF0EE',
  darkTeal: '#00A99D',
  white: '#FFFFFF',
  black: '#333333',
  gray: '#A0A0A0',
  lightGray: '#F9F9F9',
  border: '#E0E0E0',
};

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  // Dummy image if backend doesn't provide one
  const dummyImage = require('../assets/default-user.png');

  // Load profile from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log('🔹 Loading user profile');
        const jsonValue = await AsyncStorage.getItem('@user_profile');
        if (jsonValue) {
          const data = JSON.parse(jsonValue);
          setName(data.name || '');
          setEmail(data.email || '');
          setImageUri(data.imageUri || '');
          console.log('✅ Loaded profile from AsyncStorage:', data);
        }
      } catch (error) {
        console.log('❌ Error loading profile:', error.message);
      }
    };
    loadProfile();
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    await launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        const selectedImage = response.assets[0].uri;
        setImageUri(selectedImage);
        console.log('📸 Selected new profile image:', selectedImage);
      }
    });
  };

  // Update profile
  const handleUpdate = async () => {
    console.log('🔹 Update button pressed');
    console.log('Current name:', name);
    console.log('Current email:', email);

    if (!name.trim() && !email.trim()) {
      console.log('❌ No name or email entered');
      Alert.alert('Error', 'Please enter name or email to update.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if (name) {
        formData.append('name', name);
        console.log('Appending name to FormData:', name);
      }
      if (email) {
        formData.append('email', email);
        console.log('Appending email to FormData:', email);
      }

      // Add dummy image file to match backend form structure
      const finalImageUri = imageUri || Image.resolveAssetSource(dummyImage).uri;
      formData.append('file', {
        uri: finalImageUri,
        type: 'image/jpeg',
        name: 'dummy.jpg',
      });
      console.log('Appending image to FormData:', finalImageUri);

      console.log('📤 Sending request to /user/profile/update...');
      const response = await api.post('/user/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('✅ Profile update response:', response.data);

      // Save updated profile locally
      const updatedProfile = { name, email, imageUri: finalImageUri };
      await AsyncStorage.setItem('@user_profile', JSON.stringify(updatedProfile));
      console.log('💾 Saved updated profile to AsyncStorage');

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('❌ Profile update error:', error.response || error.message);
      Alert.alert('Error', 'Failed to update profile. Try again.');
    } finally {
      setLoading(false);
      console.log('🔹 Update process finished');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={28} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          {/* Profile Image */}
          <View style={styles.profilePicSection}>
            <Image
              source={imageUri ? { uri: imageUri } : dummyImage}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editPhotoButton} onPress={pickImage}>
              <Text style={styles.editPhotoButtonText}>Edit Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <SimpleLineIcons name="user" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputContainer}>
              <SimpleLineIcons name="envelope" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Update Button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.updateButton, loading && { opacity: 0.7 }]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.updateButtonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.black },
  content: { flex: 1, paddingHorizontal: 30 },
  profilePicSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  editPhotoButton: {
    backgroundColor: COLORS.lightTeal,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  editPhotoButtonText: {
    color: COLORS.darkTeal,
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: { width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 35,
  },
  input: {
    flex: 1,
    marginLeft: 15,
    paddingBottom: 8,
    fontSize: 16,
    color: COLORS.black,
  },
  buttonWrapper: {
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    paddingTop: 10,
  },
  updateButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
