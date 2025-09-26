import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
      <Image
        source={{
          uri: review.user_avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        }}
        style={styles.avatar}
      />
      <View style={styles.reviewerInfo}>
        <Text style={styles.reviewerName}>{review.user_name || 'Anonymous'}</Text>
        <Text style={styles.reviewTimestamp}>
          {new Date(review.created_at).toLocaleDateString()},{' '}
          {new Date(review.created_at).toLocaleTimeString()}
        </Text>
      </View>
    </View>
    <Text style={styles.reviewText}>{review.review_text}</Text>
    <View style={styles.ratingsContainer}>
      <View style={styles.ratingItem}>
        <StarRating rating={review.taste_rating} />
        <Text style={styles.ratingLabel}>Taste</Text>
      </View>
      <View style={styles.ratingItem}>
        <StarRating rating={review.portion_rating} />
        <Text style={styles.ratingLabel}>Portion Size</Text>
      </View>
    </View>
  </View>
);

const ReviewsScreen = ({ route }) => {
  const { chefId } = route.params;
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://13.204.84.41/api/chef/${chefId}/reviews`);
        const data = await res.json();
        if (res.ok) setReviewsData(data || []);
      } catch (err) {
        console.log('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [chefId]);

  if (loading)
    return <ActivityIndicator size="large" color="#00A99D" style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.reviewsTitle}>{reviewsData.length} Reviews</Text>
      <FlatList
        data={reviewsData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No reviews yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

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
