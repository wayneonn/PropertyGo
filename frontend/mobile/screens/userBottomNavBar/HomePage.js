import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, TextInput, ActivityIndicator, FlatList, } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCardSmall';
import { getPropertiesByFavoriteCount, getRecentlyAddedProperties, getPropertiesByRegion, searchProperties } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import RegionPropertyList from '../propertyListings/RegionPropertyList';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import ImageSwiper from '../propertyListings/ImageSwiper';
import { Dimensions } from 'react-native';



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
  const [sortedPopularProperties, setSortedPopularProperties] = useState([]);
  const [sortedRecentlyAddedProperties, setSortedRecentlyAddedProperties] = useState([]);
  const { width } = Dimensions.get('window');
  const [scrollIndex, setScrollIndex] = useState(0);
  const iconSize = 30;
  const handleScroll = (event) => {
    // Calculate the current page (icon set index)
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setScrollIndex(currentIndex);
  };

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
      // console.log('Home page gained focus');
      loadPopularProperties();
      loadRecentlyAddedProperties();
      setSearchQuery('');
    }, [])
  );

  const loadPopularProperties = async () => {
    try {
      const { success, data } = await getPropertiesByFavoriteCount();

      if (success) {
        // const sortedProperties = data.sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 10);
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
        // const sortedProperties = data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 10);
        setRecentlyAddedProperties(data);
      } else {
        console.error('Error loading recently added properties:', data.message);
      }
    } catch (error) {
      console.error('Error loading recently added properties:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewAllProperties = (properties, title) => {
    navigation.navigate('PropertyList', { properties, title });
  };

  const handleTitlePress = (title, properties) => {
    navigation.navigate('Properties List', { title: title, properties: properties, navigation: navigation });
  };

  const handleRegionPress = (title, region) => {
    navigation.navigate('Region Property List', { title: title, navigation: navigation, region: region });
  };

  const handleFlatTypePress = (title, flatType) => {
    navigation.navigate('Flat Type Property List', { title: title, navigation: navigation, flatType: flatType });
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
      // if (searchTimeout) {
      //   clearTimeout(searchTimeout);
      // }
      // const timeout = setTimeout(() => {
      fetchSuggestions(text);
      // }, 0); // Adjust the delay as needed (e.g., 500 milliseconds)
      // setSearchTimeout(timeout);
    }
  };

  const navigationIcons = [
    { name: 'Popular', icon: "trending-up-outline", target: 'Popular Properties', properties: popularProperties, iconAvail: true, isFlatType: false },
    { name: 'Recent', icon: "time-outline", target: 'Recently Added Properties', properties: recentlyAddedProperties, iconAvail: true, isFlatType: false },
    { name: 'North Area', icon: "arrow-up-circle-outline", target: 'North Area Properties', region: "North", iconAvail: true, isFlatType: false },
    { name: 'North-East', icon: "arrow-up-circle-outline", target: 'North-East Area List', region: "North-East", iconAvail: true, isFlatType: false },
    { name: 'Central Area', icon: "navigate-circle-outline", target: 'Central Area List', region: "Central", iconAvail: true, isFlatType: false },
    { name: 'West Area', icon: "arrow-back-circle-outline", target: 'West Area List', region: "West", iconAvail: true, isFlatType: false },
    { name: 'East Area', icon: "arrow-forward-circle-outline", target: 'East Area List', region: "East", iconAvail: true, isFlatType: false },
    { name: '1 Room', icon: "1", target: '1 Room List', flatType: "1_ROOM", isFlatType: true },
    { name: '2 Room', icon: "2", target: '2 Room List', flatType: "2_ROOM", isFlatType: true },
    { name: '3 Room', icon: "3", target: '3 Room List', flatType: "3_ROOM", isFlatType: true },
    { name: '4 Room', icon: "4", target: '4 Room List', flatType: "4_ROOM", isFlatType: true },
    { name: '5 Room', icon: "5", target: '5 Room List', flatType: "5_ROOM", isFlatType: true },
    { name: 'Executive', icon: "expand-outline", target: 'Executive Flat List', flatType: "EXECUTIVE", isFlatType: true, iconAvail: true },
    { name: 'Multi-Gen', icon: "people-circle-outline", target: 'Multi-Generation Flat List', flatType: "MULTI-GENERATION", isFlatType: true, iconAvail: true },
    // Add more icons and targets as needed
  ];

  const navigationFlatTypeIcons = [
    { name: '1 Room', icon: "1", target: 'Popular Properties', properties: popularProperties },
    { name: '2 Room', icon: "2", target: 'Recently Added Properties', properties: recentlyAddedProperties },
    { name: '3 Room', icon: "3", target: 'North Area Properties', region: "North" },
    { name: '4 Room', icon: "4", target: 'North-East Area List', region: "North-East" },
    { name: '5 Room', icon: "5", target: 'Central Area List', region: "Central" },
    { name: 'Executive', icon: "expand-outline", target: 'West Area List', region: "West", iconAvail: true },
    { name: 'Multi-Gen', icon: "people-circle-outline", target: 'East Area List', region: "East", iconAvail: true },
    // Add more icons and targets as needed
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Enter Postal Code/ District"
          placeholderTextColor="gray"
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
          <View style={styles.iconScrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {navigationIcons.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => icon.region == null && icon.flatType == null ?
                    (
                      handleTitlePress(icon.target, icon.properties)
                    ) : (
                      icon.flatType != null ?
                        (
                          handleFlatTypePress(icon.target, icon.flatType)
                        ) :
                        (
                          handleRegionPress(icon.target, icon.region)
                        )
                    )}
                  style={styles.iconContainer}
                >
                  <View style={[styles.iconCircle, icon.name === 'North-East' && { transform: [{ rotate: '45deg' }] }]}>
                    {icon.iconAvail === true ?
                      (
                        <Ionicons name={icon.icon} size={iconSize} />
                      ) :
                      (
                        <Text style={styles.iconRoomText}>{icon.icon}</Text>
                      )
                    }
                  </View>
                  <Text style={styles.iconText}>{icon.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* <View style={styles.iconScrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {navigationFlatTypeIcons.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => icon.region == null ? handleTitlePress(icon.target, icon.properties) : handleRegionPress(icon.target, icon.region)}
                  style={styles.iconContainer}
                >
                  <View style={[styles.iconCircle, icon.name === 'North-East' && { transform: [{ rotate: '45deg' }] }]}>
                    {icon.iconAvail === true ?
                      (
                        <Ionicons name={icon.icon} size={iconSize} />
                      ) :
                      (
                        <Text style={styles.iconRoomText}>{icon.icon}</Text>
                      )
                    }

                  </View>
                  <Text style={styles.iconText}>{icon.name}</Text>

                </TouchableOpacity>
              ))}
            </ScrollView>
          </View> */}

          {/* Popular Properties Section */}
          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={() => handleTitlePress('Popular Properties', popularProperties)}>
              <View style={[styles.titleContainer, { marginTop: 10 }]}>
                <Text style={styles.sectionTitle}> {' '}<Ionicons name="trending-up-outline" size={24} style={styles.titleIcon} />
                  {' '}Popular Properties</Text>
              </View>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {popularProperties.slice(0, 10).map((property) => (
                <PropertyCard
                  key={property.propertyListingId}
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
              {recentlyAddedProperties.slice(0, 10).map((property) => (
                <PropertyCard
                  key={property.propertyListingId}
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
  iconScrollContainer: {
    flexDirection: 'row',
    width: '96.5%',
    paddingBottom: 5,
    paddingTop: 20, // Adjust the padding as needed
    paddingLeft: 15, // Adjust the margin as needed
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 20, // Space between icons
  },
  iconImage: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    marginBottom: 5, // Space between icon and text
  },
  iconText: {
    fontSize: 12, // Adjust font size as needed
    letterSpacing: 0.75,
  },
  iconRoomText: {
    fontSize: 18, // Adjust font size as needed
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 30 * 2, // Make the circle's diameter twice the size of the icon
    height: 30 * 2, // Make the circle's diameter twice the size of the icon
    borderRadius: 30, // The borderRadius should be half the diameter to make it a circle
    backgroundColor: '#FFD700', // The background color of the circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5, // Space between the icon circle and text
  },
});

export default HomePage;
