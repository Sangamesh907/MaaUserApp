// screens/FilterComponent.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const COLORS = {
  primary: '#00A99D',
  lightPrimary: '#E6F6F5',
  blue: '#4A90E2',
  white: '#FFFFFF',
  black: '#333',
  gray: '#888',
  lightGray: '#F7F8FA',
  border: '#E0E0E0',
  starGold: '#FFD700',
};

const FilterChip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}>
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const RadioButton = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const StarRatingRow = ({ ratingValue, selected, onPress }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <View style={styles.starContainer}>
      {[...Array(5)].map((_, index) => (
        <Ionicons
          key={index}
          name="star"
          size={20}
          color={index < ratingValue ? COLORS.starGold : COLORS.border}
        />
      ))}
    </View>
  </TouchableOpacity>
);

const FilterSection = ({ title, onReset, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onReset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

const FilterComponent = ({ onClose }) => {
  const [foodStyle, setFoodStyle] = useState('Andhra');
  const [serviceType, setServiceType] = useState('Breakfast');
  const [menuType, setMenuType] = useState('Veg');
  const [sortBy, setSortBy] = useState(null);
  const [chefRating, setChefRating] = useState(null);
  const [offers, setOffers] = useState(null);

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={28} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity>
            <Text style={styles.resetAllText}>Reset All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <FilterSection title="Food Style">
            <View style={styles.chipGroup}>
              {['Andhra', 'Telangana', 'Karnataka', 'Maharastrian', 'Tamil Nadu', 'Kerala'].map((item) => (
                <FilterChip key={item} label={item} selected={foodStyle === item} onPress={() => setFoodStyle(item)} />
              ))}
            </View>
          </FilterSection>

          <FilterSection title="Service Type">
            <View style={styles.chipGroup}>
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((item) => (
                <FilterChip key={item} label={item} selected={serviceType === item} onPress={() => setServiceType(item)} />
              ))}
            </View>
          </FilterSection>

          <FilterSection title="Packages">
            <RadioButton label="Monthly" selected={false} onPress={() => {}} />
          </FilterSection>

          <FilterSection title="Menu Type">
            <View style={styles.chipGroup}>
              {['Veg', 'Non-Veg', 'Egg'].map((item) => (
                <FilterChip key={item} label={item} selected={menuType === item} onPress={() => setMenuType(item)} />
              ))}
            </View>
          </FilterSection>

          <FilterSection title="Sort by">
            <RadioButton label="Top Rated" selected={sortBy === 'Top Rated'} onPress={() => setSortBy('Top Rated')} />
            <RadioButton label="Cost : Low to High" selected={sortBy === 'Low to High'} onPress={() => setSortBy('Low to High')} />
            <RadioButton label="Cost : High to Low" selected={sortBy === 'High to Low'} onPress={() => setSortBy('High to Low')} />
            <RadioButton label="Fast Delivery" selected={sortBy === 'Fast Delivery'} onPress={() => setSortBy('Fast Delivery')} />
          </FilterSection>

          <FilterSection title="Chef Rating">
            {[1, 2, 3, 4, 5].map(rating => (
              <StarRatingRow key={rating} ratingValue={rating} selected={chefRating === rating} onPress={() => setChefRating(rating)} />
            ))}
          </FilterSection>

          <FilterSection title="Offers">
            <RadioButton label="50% Off" selected={offers === '50%'} onPress={() => setOffers('50%')} />
            <RadioButton label="40% Off" selected={offers === '40%'} onPress={() => setOffers('40%')} />
            <RadioButton label="30% Off" selected={offers === '30%'} onPress={() => setOffers('30%')} />
          </FilterSection>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { maxHeight: '85%', backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  resetAllText: { color: COLORS.blue, fontWeight: '600' },
  section: { marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  resetText: { color: COLORS.gray, fontWeight: '500' },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 10, marginBottom: 10 },
  chipSelected: { backgroundColor: COLORS.lightPrimary, borderColor: COLORS.primary },
  chipText: { color: COLORS.gray },
  chipTextSelected: { color: COLORS.primary, fontWeight: 'bold' },
  radioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  radioOuterSelected: { borderColor: COLORS.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  radioLabel: { marginLeft: 12, fontSize: 16, color: COLORS.black },
  starContainer: { flexDirection: 'row', marginLeft: 12 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: COLORS.border },
  applyButton: { backgroundColor: COLORS.blue, paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  applyButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});

export default FilterComponent;
