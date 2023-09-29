import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PropertyCard from './PropertyCardSmall'; // Import your PropertyCard component
import { getPropertiesByRegion } from '../../utils/api';

const RegionPropertyList = ({ region, onPropertyPress, handleTitlePress }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadPropertiesByRegion(region);
  }, [region]);

  const loadPropertiesByRegion = async (region) => {
    try {
      const { success, data } = await getPropertiesByRegion(region);

      if (success) {
        setProperties(data);
      } else {
        console.error(`Error loading properties in ${region}:`, data.message);
      }
    } catch (error) {
      console.error(`Error loading properties in ${region}:`, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleTitlePress(region, properties)}>
        <Text style={styles.sectionTitle}>{region} Properties</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {properties.map((property) => (
          <PropertyCard key={property.propertyId} property={property} onPress={() => onPropertyPress(property.propertyListingId)} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default RegionPropertyList;
