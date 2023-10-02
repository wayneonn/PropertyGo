import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCardSmall';
import { getPropertiesByFavoriteCount, getRecentlyAddedProperties, getPropertiesByRegion } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import RegionPropertyList from '../propertyListings/RegionPropertyList';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const SearchBar = () => {
  return (
    <View style={styles.searchBar}>
      <TextInput placeholder="Enter Postal Code/MRT Address/District" style={styles.searchInput} />
      <TouchableOpacity style={styles.searchIconContainer}>
        <Image source={require('../../assets/Top-Navbar-Icons/search-icon.png')} style={styles.searchIcon} />
      </TouchableOpacity>
    </View>
  );
};

const HomePage = ({ navigation }) => {
  const [popularProperties, setPopularProperties] = useState([]);
  const [recentlyAddedProperties, setRecentlyAddedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { user } = useContext(AuthContext);
  const userId = user.user.userId;
  const [canRunEffect, setCanRunEffect] = useState(true);

  const handlePropertyPress = (propertyListingId) => {
    // Navigate to the Property Listing screen with the given propertyListingId
    navigation.navigate('Property Listing', { propertyListingId });
  };

  useEffect(() => {
    // Load popular properties
    loadPopularProperties();
    // Load recently added properties
    loadRecentlyAddedProperties();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      console.log('Home page gained focus');
      loadPopularProperties();
      loadRecentlyAddedProperties();
    }, [])
  );

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
    } finally {
      setIsLoading(false); // Set loading to false when data is loaded or an error occurs
    }
  };

  const viewAllProperties = (properties, title) => {
    navigation.navigate('PropertyList', { properties, title });
  };

  const handleTitlePress = (title, properties) => {
    navigation.navigate('Properties List', { title: title, properties: properties, navigation: navigation });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search bar */}
      <SearchBar />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          {/* Popular Properties Section */}
          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={() => handleTitlePress('Popular Properties', popularProperties)}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}> {' '}<Ionicons name="trending-up-outline" size={24} style={styles.titleIcon} />
                {' '}Popular Properties</Text>
              </View>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {popularProperties.map((property) => (
                <PropertyCard
                  key={property.propertyId}
                  property={property}
                  onPress={() => handlePropertyPress(property.propertyListingId)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Recently Added Properties Section */}
          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={() => handleTitlePress('Recently Added Properties', recentlyAddedProperties)}>
            <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}> {' '}<Ionicons name="time-outline" size={24} style={styles.titleIcon} />
                {' '}Recently Added Properties</Text>
              </View>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentlyAddedProperties.map((property) => (
                <PropertyCard
                  key={property.propertyId}
                  property={property}
                  onPress={() => handlePropertyPress(property.propertyListingId)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Regions Section */}
          <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}> {' '}<Ionicons name="navigate-circle-outline" size={24} style={styles.titleIcon} />
                {' '}Regions</Text>
            <RegionPropertyList region="North" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
            <RegionPropertyList region="North-East" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
            <RegionPropertyList region="South" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
            <RegionPropertyList region="East" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
            <RegionPropertyList region="West" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
            <RegionPropertyList region="Central" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
          </View>
        </>
      )}
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'grey',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  mainContentImage: {
    alignSelf: 'center',
    width: '90%',
    height: '15%',
  },
  propertyListing: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  propertyImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  propertyDetails: {
    flex: 1,
  },
  propertyDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  propertyPrice: {
    fontSize: 14,
    color: '#888',
  },
  propertyArea: {
    fontSize: 14,
    color: '#888',
  },
  propertyRoomFeatures: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 10, // Add right margin for the icon
  },
});

export default HomePage;
