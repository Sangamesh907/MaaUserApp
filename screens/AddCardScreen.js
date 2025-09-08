import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

// Reusable labeled input field
const LabeledInput = ({
  label,
  placeholder,
  keyboardType,
  secureTextEntry,
  style,
}) => (
  <View style={[styles.inputGroup, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#B0B0B0"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const AddCardScreen = () => {
  const navigation = useNavigation();
  const [saveCard, setSaveCard] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Card</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* --- Form Content --- */}
      <ScrollView contentContainerStyle={styles.container}>
        <LabeledInput
          label="Card Holder Name"
          placeholder="Enter card holder name"
        />
        <LabeledInput
          label="Card Number"
          placeholder="0123 4567 8901 2345"
          keyboardType="numeric"
        />
        <View style={styles.row}>
          <LabeledInput
            label="CVV"
            placeholder="***"
            keyboardType="numeric"
            secureTextEntry={true}
            style={{ flex: 1, marginRight: 8 }}
          />
          <LabeledInput
            label="Expiry Date"
            placeholder="MM/YY"
            keyboardType="numeric"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        {/* --- Save Card Checkbox --- */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={saveCard}
            onValueChange={setSaveCard}
            tintColors={{ true: '#3379FF', false: '#999' }}
          />
          <Text style={styles.checkboxLabel}>Save card for future payments</Text>
        </View>
      </ScrollView>

      {/* --- Continue Button --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: '#424242',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  continueButton: {
    backgroundColor: '#3379FF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
