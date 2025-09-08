// screens/CartEmptyScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../context/CartContext';

const CartEmptyScreen = ({ navigation }) => {
  const { addItem } = useContext(CartContext);

  const handleAddItem = async () => {
    await addItem({
      name: 'Dosa',
      quantity: 1,
      price: 120,
      chef: 'Lakshmi',
      location: 'HSR Layout',
    });
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      {/* Empty Cart Content */}
      <View style={styles.content}>
        <Image
          source={require('../assets/empty-cart.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Your Cart is Empty</Text>
        <Text style={styles.description}>
          Add items to your cart to see them here.
        </Text>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddItem}>
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  image: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { textAlign: 'center', color: '#555', lineHeight: 20 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2ecc71',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 999,
  },
});

export default CartEmptyScreen;
