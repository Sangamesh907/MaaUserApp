import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

export default function OTPScreen({ navigation }) {
  const route = useRoute();
  const { login } = useContext(AuthContext);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  
  const mobile = route.params?.mobile;

  useEffect(() => {
    if (!mobile) {
      console.warn('No mobile number found. Navigating back to Login.');
      navigation.replace('Login'); 
    }
  }, [mobile, navigation]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) inputs.current[index + 1].focus();
  };

  const handleVerifyOTP = () => {
    const finalOtp = otp.join('');
    if (finalOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter all 4 digits.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // ✅ Fake OTP login: Save token in context
      login({
        token: 'fake-token-123',       // fake token
        tokenType: 'Bearer',
        phone: mobile,
        user: { name: 'Demo User' },   // fake user
      });

      Alert.alert('Success', 'Logged in successfully!');
      navigation.replace('Main'); // Navigate to home
    }, 1000);
  };

  if (!mobile) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 20 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.heading}>Verify Mobile</Text>
      <Text style={styles.subtext}>Enter OTP sent to {mobile}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(text, index)}
            value={digit}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.resendBtn} onPress={() => Alert.alert('OTP Resent!')}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOTP} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <Text style={styles.verifyText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#007bff', padding: 20, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 40, left: 20 },
  heading: { fontSize: 24, color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  subtext: { fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 10 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginHorizontal: 20 },
  otpBox: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 8, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  resendBtn: { marginTop: 20 },
  resendText: { textAlign: 'center', color: '#fff', textDecorationLine: 'underline' },
  verifyBtn: { marginTop: 30, backgroundColor: '#fff', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
  verifyText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },
});
