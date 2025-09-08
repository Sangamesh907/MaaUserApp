import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const COLORS = {
  primary: '#00A99D',
  lightPrimary: '#E0F2F1',
  white: '#FFFFFF',
  black: '#333333',
  lightGray: '#F7F8FA',
  gray: '#888888',
};

const CustomerSupportScreen = ({ navigation }) => {
  const supportEmail = 'support@maakitchen.com';
  const supportPhone = '+91 8792364286';

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${supportEmail}`).catch(() =>
      Alert.alert('Error', 'Unable to open email app')
    );
  };

  const handleCallPress = () => {
    Linking.openURL(`tel:${supportPhone}`).catch(() =>
      Alert.alert('Error', 'Unable to initiate call')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Customer Support</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.subtitle}>We’re here to assist you.</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{supportEmail}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{supportPhone}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Chat with Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#00796B' }]} onPress={handleCallPress}>
          <Ionicons name="call-outline" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Call Us</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: COLORS.black,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CustomerSupportScreen;
