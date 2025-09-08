import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FaqScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const faqData = [
    'I want to cancel my order',
    'Can I edit my order',
    'I want to provide feedback',
    'I want to cancel my order',
    'I want to provide feedback',
    'I want to cancel my order',
  ];

  return (
    <View style={styles.container}>
      <Header title="FAQ's" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        {faqData.map((question, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              onPress={() => setExpandedIndex(index === expandedIndex ? null : index)}
              style={styles.questionRow}
            >
              <Text style={styles.question}>{question}</Text>
              <Icon name={expandedIndex === index ? 'chevron-up' : 'chevron-forward'} size={18} />
            </TouchableOpacity>

            {expandedIndex === index && (
              <Text style={styles.answer}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry...
              </Text>
            )}
          </View>
        ))}
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
    marginBottom: 12,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: { fontWeight: 'bold', fontSize: 15 },
  answer: { marginTop: 8, fontSize: 13, color: '#444' },
});
