import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo12.png')} style={styles.logo} />
      

      <View style={styles.form}>
        <Text style={styles.label}>Login with Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Mobile Number"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => navigation.navigate('OTP')}>
          <Text style={styles.sendBtnText}>Send OTP</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>
        <Text style={styles.socialText}>Login with Social Accounts</Text>

        <View style={styles.socialIcons}>
          <Icon name="facebook" size={30} color="#3b5998" />
          <Icon name="twitter" size={30} color="#1DA1F2" style={styles.iconSpacing} />
          <Icon name="envelope" size={30} color="#EA4335" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3f7ffb', // changed color
  },
  logo: {
    width: 250,         // updated size
    height: 200,
    alignSelf: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    fontSize: 16,
    marginBottom: 20,
    paddingVertical: 5,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
  socialText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 60,
  },
  iconSpacing: {
    marginHorizontal: 20,
  },
});
