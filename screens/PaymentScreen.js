import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PAYMENT_OPTIONS = {
  CARD_1: 'CARD_1',
  CARD_2: 'CARD_2',
  CARD_3: 'CARD_3',
  NET_ICICI: 'NET_ICICI',
  NET_HDFC: 'NET_HDFC',
  NET_SBI: 'NET_SBI',
  NET_AXIS: 'NET_AXIS',
  RAZORPAY: 'RAZORPAY',
  GOOGLE_PAY: 'GOOGLE_PAY',
  AMAZON_PAY: 'AMAZON_PAY',
  PHONEPE: 'PHONEPE',
  PAYTM: 'PAYTM',
};

const PaymentOptionRow = ({
  iconName,
  iconColor,
  label,
  value,
  selectedValue,
  onSelect,
  isLast = false,
}) => {
  return (
    <TouchableOpacity onPress={() => onSelect(value)} activeOpacity={0.7}>
      <View style={styles.optionRow}>
        <Icon name={iconName} size={26} color={iconColor || '#555'} style={styles.icon} />
        <Text style={styles.optionLabel}>{label}</Text>
        <View style={[styles.radio, selectedValue === value && styles.radioSelected]}>
          {selectedValue === value && <View style={styles.radioInner} />}
        </View>
      </View>
      {!isLast && <View style={styles.divider} />}
    </TouchableOpacity>
  );
};

const PaymentScreen = () => {
  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS.CARD_1);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Credit & Debit Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Credit and Debit Cards</Text>
            <TouchableOpacity
             style={styles.addNewCardButton}
             onPress={() => navigation.navigate('AddCard')} 
            >
              <Text style={styles.addNewCardText}>+ Add New Card</Text>
             </TouchableOpacity>

          </View>
          <View style={styles.card}>
            <PaymentOptionRow
              iconName="card-outline"
              label="5241-XXXX-XXXX-4875"
              value={PAYMENT_OPTIONS.CARD_1}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="card-outline"
              label="4111-XXXX-XXXX-2231"
              value={PAYMENT_OPTIONS.CARD_2}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="card-outline"
              label="3500-XXXX-XXXX-7593"
              value={PAYMENT_OPTIONS.CARD_3}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
              isLast
            />
          </View>
        </View>

        {/* Net Banking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Net Banking</Text>
          <View style={styles.card}>
            <PaymentOptionRow
              iconName="business-outline"
              label="ICICI Bank"
              value={PAYMENT_OPTIONS.NET_ICICI}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="business-outline"
              label="HDFC Bank"
              value={PAYMENT_OPTIONS.NET_HDFC}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="business-outline"
              label="SBI Bank"
              value={PAYMENT_OPTIONS.NET_SBI}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="business-outline"
              label="Axis Bank"
              value={PAYMENT_OPTIONS.NET_AXIS}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
              isLast
            />
          </View>
        </View>

        {/* Wallets & UPI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallets & UPI</Text>
          <View style={styles.card}>
            <PaymentOptionRow
              iconName="logo-usd"
              label="Razorpay"
              value={PAYMENT_OPTIONS.RAZORPAY}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="logo-google"
              label="Google Pay"
              value={PAYMENT_OPTIONS.GOOGLE_PAY}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="logo-amazon"
              label="Amazon Pay"
              value={PAYMENT_OPTIONS.AMAZON_PAY}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="logo-whatsapp" // used as a substitute for PhonePe
              label="PhonePe"
              value={PAYMENT_OPTIONS.PHONEPE}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="logo-paypal" // close enough for Paytm visual
              label="Paytm"
              value={PAYMENT_OPTIONS.PAYTM}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
              isLast
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
  style={styles.payButton}
  activeOpacity={0.8}
  onPress={() => navigation.navigate('OrderConfirmation')}
>
  <Text style={styles.payButtonText}>Pay</Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addNewCardButton: {
    backgroundColor: '#E0F2F1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addNewCardText: {
    color: '#00796B',
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 16,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#00796B',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00796B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  payButton: {
    backgroundColor: '#3379FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
