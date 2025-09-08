import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TermsAndConditionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Terms and Condition's" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>TERMS OF USE</Text>
        <Text style={styles.text}>
          Welcome to Maakichen. This Platform is owned and operated by Maakichen, a company incorporated under the laws of India. The Platform connects home chefs and users who wish to avail services of online food delivery.
          
          A customer can place orders from a variety of products listed by home chefs ("Merchants"), and Maakichen enables delivery of these Orders using your services as a delivery personnel ("Delivery Personnel").
        </Text>

        <Text style={styles.subtitle}>Applicability and Amendment of Terms</Text>
        <Text style={styles.text}>
          These Terms apply to all users who register as Delivery Personnel. Please review these Terms periodically. Continued use of the Platform signifies your acceptance of the amended Terms.
        </Text>

        <Text style={styles.subtitle}>Registration and Access</Text>
        <Text style={styles.text}>
          You must provide accurate information and KYC documents to register. Access may be suspended or restricted for repairs or maintenance. You are responsible for maintaining the confidentiality of your credentials.
        </Text>

        <Text style={styles.subtitle}>Platform Content and Restrictions</Text>
        <Text style={styles.text}>
          Users shall not post harmful, misleading, illegal, or infringing content. Any such content will be subject to removal and potential legal action. Users must not tamper with the content, scrape, or misuse the platform.
        </Text>

        <Text style={styles.subtitle}>Delivery Services</Text>
        <Text style={styles.text}>
          You must deliver Orders on time, follow traffic rules, and respect customer privacy. Any tampering with Orders or misconduct will result in termination. Commission is based on Order value and is paid weekly.
        </Text>

        <Text style={styles.subtitle}>Intellectual Property Rights</Text>
        <Text style={styles.text}>
          All content on Maakichen is the property of the Company. You may use it only through the platform for personal, non-commercial purposes.
        </Text>

        <Text style={styles.subtitle}>Termination</Text>
        <Text style={styles.text}>
          Breach of Terms or customer complaints may result in immediate suspension. Either party can terminate the agreement with due notice.
        </Text>

        <Text style={styles.subtitle}>Applicable Law & Arbitration</Text>
        <Text style={styles.text}>
          Disputes shall be governed by Indian laws and resolved via arbitration in the designated location.
        </Text>

        <Text style={styles.subtitle}>Grievance Officer</Text>
        <Text style={styles.text}>
          For grievances, please contact the designated Grievance Officer at grievance@maakichen.com.
        </Text>
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  text: { fontSize: 14, color: '#333', lineHeight: 20 },
});
