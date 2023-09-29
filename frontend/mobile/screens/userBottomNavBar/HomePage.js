import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCardSmall';
import { getPropertiesByFavoriteCount, getRecentlyAddedProperties, getPropertiesByRegion } from '../../utils/api';
import { AuthContext } from '../../AuthContext';

const HomePage = ({ navigation }) => {
  const [popularProperties, setPopularProperties] = useState([]);
  const [recentlyAddedProperties, setRecentlyAddedProperties] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user.user.userId;

  useEffect(() => {
    // Load popular properties
    loadPopularProperties();

    // Load recently added properties
    loadRecentlyAddedProperties();
  }, []);

  const loadPopularProperties = async () => {
    try {
      const { success, data } = await getPropertiesByFavoriteCount();

      if (success) {
        // Assuming data is an array of properties
        setPopularProperties(data);
      } else {
        console.error('Error loading popular properties:', data.message);
      }
    } catch (error) {
      console.error('Error loading popular properties:', error.message);
    }
  };

  const loadRecentlyAddedProperties = async () => {
    try {
      const { success, data } = await getRecentlyAddedProperties();

      if (success) {
        // Assuming data is an array of properties
        setRecentlyAddedProperties(data);
      } else {
        console.error('Error loading recently added properties:', data.message);
      }
    } catch (error) {
      console.error('Error loading recently added properties:', error.message);
    }
  };

  const viewAllProperties = (properties, title) => {
    navigation.navigate('PropertyList', { properties, title });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search bar */}
      {/* Include your SearchBar component here */}
      
      {/* Popular Properties Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popular Properties</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularProperties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} onPress={() => navigation.navigate('Property Listing', { propertyListingId: property.propertyListingId })} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.viewAllButton} onPress={() => viewAllProperties(popularProperties, 'Popular Properties')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Recently Added Properties Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recently Added Properties</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyAddedProperties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} onPress={() => navigation.navigate('PropertyDetails', { propertyListingId: property.propertyListingId })} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.viewAllButton} onPress={() => viewAllProperties(recentlyAddedProperties, 'Recently Added Properties')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Regions Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Regions</Text>
        {/* Include your region buttons here */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewAllButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  viewAllText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default HomePage;
