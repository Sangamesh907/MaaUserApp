import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// --- Mock Data ---
const reviewsData = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    timestamp: 'Today at 12:08 am',
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    tasteRating: 4,
    portionSizeRating: 3,
  },
  {
    id: '2',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    timestamp: 'Yesterday at 9:30 pm',
    text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    tasteRating: 5,
    portionSizeRating: 4,
  },
  {
    id: '3',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    timestamp: 'Yesterday at 7:12 pm',
    text: "It has survived not only five centuries, but also the leap into electronic typesetting.",
    tasteRating: 4,
    portionSizeRating: 4,
  },
  {
    id: '4',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    timestamp: 'Today at 8:20 am',
    text: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    tasteRating: 3,
    portionSizeRating: 3,
  },
];

// --- Components ---
const StarRating = ({ rating }) => {
  const stars = [...Array(5)].map((_, index) => (
    <MaterialIcons
      key={index}
      name={index < rating ? 'star' : 'star-border'}
      size={20}
      color={index < rating ? '#FFC107' : '#BDBDBD'}
    />
  ));
  return <View style={styles.starContainer}>{stars}</View>;
};

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Image source={{ uri: review.avatar }} style={styles.avatar} />
      <View style={styles.reviewerInfo}>
        <Text style={styles.reviewerName}>{review.name}</Text>
        <Text style={styles.reviewTimestamp}>{review.timestamp}</Text>
      </View>
    </View>
    <Text style={styles.reviewText}>{review.text}</Text>
    <View style={styles.ratingsContainer}>
      <View style={styles.ratingItem}>
        <StarRating rating={review.tasteRating} />
        <Text style={styles.ratingLabel}>Taste</Text>
      </View>
      <View style={styles.ratingItem}>
        <StarRating rating={review.portionSizeRating} />
        <Text style={styles.ratingLabel}>Portion Size</Text>
      </View>
    </View>
  </View>
);

// --- Main Component ---
const ReviewsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.reviewsTitle}>19 Reviews</Text>
      <FlatList
        data={reviewsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  listContainer: {
    paddingBottom: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  ratingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ratingItem: {
    alignItems: 'center',
  },
  ratingLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },
  starContainer: {
    flexDirection: 'row',
  },
});

export default ReviewsScreen;
