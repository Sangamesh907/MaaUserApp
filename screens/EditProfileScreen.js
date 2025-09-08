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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker'; 
import { useNavigation } from '@react-navigation/native';

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
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const jsonValue = await AsyncStorage.getItem('@user_profile');
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email);
        setImageUri(data.imageUri);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const result = await launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (!response.didCancel && !response.errorCode) {
          const selectedImage = response.assets[0].uri;
          setImageUri(selectedImage);
        }
      }
    );
  };

  const handleUpdate = async () => {
    const profile = { name, phone, email, imageUri };
    await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>

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
              source={imageUri ? { uri: imageUri } : require('../assets/default-user.png')}
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
              <SimpleLineIcons name="phone" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
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
