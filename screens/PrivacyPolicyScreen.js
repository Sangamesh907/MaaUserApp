import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Privacy Policy" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy Policy</Text>
          <Text style={styles.cardText}>
            Welcome to Maakichen! This Privacy Policy describes how we collect, use, and share information about you when you use our mobile application or website.
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.cardText}>
            • Personal Information: Name, email, phone number, delivery address, and payment details when placing an order.
            {'\n'}• Location Data: Used to show available home chefs and track delivery.
            {'\n'}• Device Information: Including mobile device ID, OS, app version, and crash reports.
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.cardText}>
            • To process and deliver your orders.
            {'\n'}• To personalize user experience and improve our services.
            {'\n'}• For customer support and communication.
            {'\n'}• To send promotional offers (only if opted-in).
          </Text>

          <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
          <Text style={styles.cardText}>
            • With home chefs and delivery personnel to fulfill your orders.
            {'\n'}• With trusted third-party service providers (e.g., payment gateways).
            {'\n'}• When required by law or government authorities.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.cardText}>
            We implement industry-standard security practices to protect your data, but cannot guarantee 100% security of internet transmissions.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.cardText}>
            • You can review, update or delete your personal information anytime through your account settings.
            {'\n'}• You can opt out of promotional messages via app settings or by contacting support.
          </Text>

          <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
          <Text style={styles.cardText}>
            Maakichen is not intended for children under the age of 13. We do not knowingly collect data from children under 13.
          </Text>

          <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
          <Text style={styles.cardText}>
            We may update this policy from time to time. Please check periodically for changes. Continued use of the app means you accept the updated policy.
          </Text>

          <Text style={styles.sectionTitle}>8. Contact Us</Text>
          <Text style={styles.cardText}>
            If you have any questions or concerns, please contact our Privacy Officer at:
            {'\n'}📧 privacy@maakichen.in
            {'\n'}📍 Maakichen Pvt. Ltd., Electronic City, Bangalore - 560100
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const Header = ({ title, navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="arrow-back-outline" size={24} />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerText: { fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  cardText: { fontSize: 14, color: '#333', lineHeight: 22 },
});
