// OrderDeliveredScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function OrderDeliveredScreen() {
  const [tasteRating, setTasteRating] = useState(4);
  const [portionRating, setPortionRating] = useState(4);
  const [reviewText, setReviewText] = useState('');
  const navigation = useNavigation();

  const renderStars = (rating, setRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Icon
            name="star"
            size={24}
            color={i <= rating ? '#FFD700' : '#ccc'}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmit = () => {
    // Optional: Save ratings and reviewText somewhere
    console.log('Taste:', tasteRating);
    console.log('Portion Size:', portionRating);
    console.log('Review:', reviewText);

    // Navigate to Home tab screen
    navigation.navigate('Main'); // adjust 'Home' to match your actual tab name
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../assets/delivery.png')}
          style={styles.deliveryImage}
        />
        <Text style={styles.deliveredText}>
          Your Order has been Successfully Delivered
        </Text>
      </View>

      <Text style={styles.ratingTitle}>Rating</Text>

      <View style={styles.ratingRow}>
        <Text style={styles.label}>Taste</Text>
        <View style={styles.stars}>{renderStars(tasteRating, setTasteRating)}</View>
      </View>

      <View style={styles.ratingRow}>
        <Text style={styles.label}>Portion Size</Text>
        <View style={styles.stars}>
          {renderStars(portionRating, setPortionRating)}
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write your experience"
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  topSection: { alignItems: 'center', marginBottom: 20 },
  deliveryImage: { width: 380, height: 250, resizeMode: 'contain' },
  deliveredText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
  ratingTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: { fontSize: 16, color: '#444' },
  stars: { flexDirection: 'row' },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
