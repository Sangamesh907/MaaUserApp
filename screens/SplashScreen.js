import React, { useEffect, useContext } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function SplashScreen({ navigation }) {
  const { authData, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('Main'); // already logged in
      } else {
        navigation.replace('Login'); // not logged in
      }
    }, 2000); // 2 seconds splash

    return () => clearTimeout(timeout);
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo11.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#3f7ffb" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
