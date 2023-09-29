import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCardSmall';
import { getPropertiesByFavoriteCount, getRecentlyAddedProperties, getPropertiesByRegion } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import RegionPropertyList from '../propertyListings/RegionPropertyList';

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
  const { user } = useContext(AuthContext);
  const userId = user.user.userId;
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

  const handleTitlePress = (title, properties) => {
    navigation.navigate('Properties List', { title: title, properties: properties, navigation: navigation});
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search bar */}
      <SearchBar />
      {/* Include your SearchBar component here */}
      {/* <Image source={require('../../assets/Home-Image.jpeg')} style={styles.mainContentImage} /> */}
      {/* Popular Properties Section */}
      <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => handleTitlePress('Popular Properties', popularProperties)}>
          <Text style={styles.sectionTitle}>Popular Properties</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularProperties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} onPress={() => navigation.navigate('Property Listing', { propertyListingId: property.propertyListingId })} />
          ))}
        </ScrollView>
      </View>

      {/* Recently Added Properties Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity onPress={() => handleTitlePress('Recently Added Properties', recentlyAddedProperties)}>
          <Text style={styles.sectionTitle}>Recently Added Properties</Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyAddedProperties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} onPress={() => navigation.navigate('Property Listing', { propertyListingId: property.propertyListingId })} />
          ))}
        </ScrollView>
      </View>

      {/* Regions Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Regions</Text>
        <RegionPropertyList region="North" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress}/>
        <RegionPropertyList region="North-East" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress}/>
        <RegionPropertyList region="South" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress}/>
        <RegionPropertyList region="East" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress}/>
        <RegionPropertyList region="West" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress}/>
        <RegionPropertyList region="Central" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress}/>
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
  sectionContainer: {
    padding: 10,
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
});

export default HomePage;