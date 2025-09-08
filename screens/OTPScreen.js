import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OTPScreen({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = () => {
    const finalOtp = otp.join('');
    if (finalOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter all 4 digits of the OTP.');
      return;
    }

    // Simulate OTP verification success
    navigation.replace('Main'); // Navigate to bottom tab screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.heading}>Verify Mobile</Text>
      <Text style={styles.subtext}>An OTP has been sent to the entered mobile number</Text>

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

      <TouchableOpacity style={styles.resendBtn}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#007bff', padding: 20, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 40, left: 20 },
  heading: { fontSize: 24, color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  subtext: { fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 10 },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginHorizontal: 20,
  },
  otpBox: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
  },
  resendBtn: { marginTop: 20 },
  resendText: { textAlign: 'center', color: '#fff', textDecorationLine: 'underline' },
  verifyBtn: {
    marginTop: 30,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  verifyText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },
});
