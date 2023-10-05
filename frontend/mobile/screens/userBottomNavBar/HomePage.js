import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, TextInput, ActivityIndicator, FlatList, } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCardSmall';
import { getPropertiesByFavoriteCount, getRecentlyAddedProperties, getPropertiesByRegion, searchProperties } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import RegionPropertyList from '../propertyListings/RegionPropertyList';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';


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
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

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
      setSearchQuery('');
    }, [])
  );

  const loadPopularProperties = async () => {
    try {
      const { success, data } = await getPropertiesByFavoriteCount();

      if (success) {
        // Assuming data is an array of properties
        const top10Properties = data
          .sort((a, b) => b.favoriteCount - a.favoriteCount)
          .slice(0, 10);
        setPopularProperties(top10Properties);
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
        const top10Properties = data
          .sort((a, b) => b.favoriteCount - a.favoriteCount)
          .slice(0, 10);
        setPopularProperties(top10Properties);
        setRecentlyAddedProperties(top10Properties);
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

  const ImageSwiper = () => {
    const images = [
      require('../../assets/Home-Image.jpeg'),
      require('../../assets/Buying-Home.jpg'),
      require('../../assets/HDB-Flats-Near-MRT.jpg'),
      // Add more image paths as needed
    ];

    return (
      <View style={styles.swiperContainer}>
        <Swiper
          showsButtons={false} loop={true} autoplay={true} autoplayTimeout={5}
        >
          {images.map((image, index) => (
            <View key={index}>
              <Image source={image} style={styles.swiperImage} />
            </View>
          ))}
        </Swiper>
      </View>
    );
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      return;
    }

    navigation.navigate('Search Results', { searchQuery });
  };

  const fetchSuggestions = async (query) => {
    try {
      const { success, data } = await searchProperties(query);

      if (success) {
        setSuggestions(data.slice(0, 10)); // Limit suggestions to 10 items
      } else {
        console.error('Error fetching search suggestions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error.message);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.address);
    setSuggestions([]);
    navigation.navigate('Search Results', { searchQuery: item.address });
  };  

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setSuggestions([]); // Clear suggestions if text is empty
    } else {
      // Add a delay before fetching suggestions
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        fetchSuggestions(text);
      }, 100); // Adjust the delay as needed (e.g., 500 milliseconds)
      setSearchTimeout(timeout);
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Enter Postal Code/MRT Address/District"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          onSubmitEditing={handleSearch} // Add this line to trigger search on Enter key press
        />
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={handleSearch}
        >
          <Image
            source={require('../../assets/Top-Navbar-Icons/search-icon.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Suggestions */}
      {searchQuery.trim() !== '' ? (
        suggestions.length > 0 ? (
          <View style={styles.suggestionsOverlay}>
            {suggestions.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  index === suggestions.length - 1 && styles.suggestionItemLast,
                ]}
                onPress={() => handleSuggestionClick(item)}
              >
                <Text style={styles.suggestionText}>{item.address}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No search results found</Text>
          </View>
        )
      ) : null}
      <ImageSwiper />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          {/* Popular Properties Section */}
          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={() => handleTitlePress('Popular Properties', popularProperties)}>
              <View style={[styles.titleContainer, { marginTop: 10 }]}>
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
            <RegionPropertyList region="Central" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
            <RegionPropertyList region="East" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
            <RegionPropertyList region="West" onPropertyPress={handlePropertyPress} handleTitlePress={handleTitlePress} />
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
  swiperImage: {
    width: '100%',
    height: '100%', // Adjust the height as needed
  },
  swiperContainer: {
    height: 130, // Set the desired height
    marginLeft: 15, // Add left padding
    marginRight: 15, // Add right padding
    alignSelf: 'center', // Center horizontally
  },
  suggestionsContainer: {
    width: '80%', // Take up 80% width
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: 'center',
    elevation: 5, // Add elevation for shadow effect (Android)
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
    shadowOffset: { width: 0, height: 2 }, // Add shadow (iOS)
    shadowOpacity: 0.8, // Add shadow (iOS)
    shadowRadius: 2, // Add shadow (iOS)
  },
  suggestionBorder: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'white', // Match background color
    height: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionItemLast: {
    borderBottomWidth: 0, // Remove border for the last item
  },
  suggestionText: {
    fontSize: 14, // Make text smaller
  },
  suggestionsOverlay: {
    position: 'absolute',
    top: 50, // Adjust the top position as needed
    left: 8,
    right: 0,
    zIndex: 1,
    width: '95%', // Take up 80% width
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: 'center',
    elevation: 5, // Add elevation for shadow effect (Android)
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
    shadowOffset: { width: 0, height: 2 }, // Add shadow (iOS)
    shadowOpacity: 0.8, // Add shadow (iOS)
    shadowRadius: 2, // Add shadow (iOS)
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    top: 50, // Adjust the top position as needed
    left: 8,
    right: 0,
    zIndex: 1,
    width: '95%', // Take up 80% width
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: 'center',
    elevation: 5, // Add elevation for shadow effect (Android)
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Add shadow (iOS)
    shadowOffset: { width: 0, height: 2 }, // Add shadow (iOS)
    shadowOpacity: 0.8, // Add shadow (iOS)
    shadowRadius: 2, // Add shadow (iOS)
  },
  noResultsText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default HomePage;
