import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PropertyCardUser from '../propertyListings/PropertyCardUser';
import PropertyCardRectangle from '../propertyListings/PropertyCardRectangle';
import { getUserFavorites, removeFavoriteProperty, isPropertyInFavorites, getPropertiesByUser } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import MapView, { Marker, Callout } from 'react-native-maps';


const UserListings = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSquareLayout, setIsSquareLayout] = useState(true);
  const { user } = useContext(AuthContext);
  const [isMapVisible, setIsMapVisible] = useState(false); // State variable to track map visibility

  const fetchFavorites = async () => {
    const userId = user.user.userId;
    const { success, data } = await getPropertiesByUser(userId);
    if (success) {
      const updatedFavorites = await Promise.all(
        data.map(async (property) => {
          const { success, data } = await isPropertyInFavorites(
            userId,
            property.propertyId
          );
          return {
            ...property,
            isFavorite: success && data.isLiked,
          };
        })
      );
      setFavorites(updatedFavorites);
    }
  };

  const handleFavoritePress = async (propertyId) => {
    const userId = user.user.userId;
    const property = favorites.find((p) => p.propertyId === propertyId);
    if (property) {
      const { success } = await removeFavoriteProperty(userId, propertyId);
      if (success) {
        setFavorites((prevFavorites) =>
          prevFavorites.map((p) =>
            p.propertyId === propertyId ? { ...p, isFavorite: false } : p
          )
        );
      }
    }
  };

  const filteredFavorites = favorites.filter((property) =>
    property.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCardLayout = () => {
    setIsSquareLayout((prevIsSquareLayout) => !prevIsSquareLayout);
  };

  const toggleMapView = () => {
    setIsMapVisible((prevIsMapVisible) => !prevIsMapVisible);
  };

  // Use useFocusEffect to refresh the screen when it gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const initialRegion = {
    latitude: 1.361588, // Default to West Area Properties coordinates
    longitude: 103.805249,
    latitudeDelta: 0.35,
    longitudeDelta: 0.35,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>User Listings</Text>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by property title"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />

        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleMapButton]} onPress={toggleMapView}>
            <Ionicons
              name={isMapVisible ? 'stop-outline' : 'map'} // Change icon based on map visibility
              size={20}
              color="white"
              style={{ marginLeft: 5 }}
            />
            <Text style={styles.toggleMapButtonText}>
              {isMapVisible ? 'Hide Map' : 'Show Map'}{' '}
            </Text>
          </TouchableOpacity>
          <Text>{'                                            '}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleCardLayout}>
            <Ionicons
              name={isSquareLayout ? 'list' : 'grid'}
              size={24}
              color="#333"
              style={{ marginLeft: -5 }}
            />
            <Text style={styles.toggleLabel}>
              {isSquareLayout ? 'List' : 'Grid'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditionally render the MapView based on isMapVisible */}
        {isMapVisible && (
          <MapView style={styles.map} initialRegion={initialRegion}>
            {filteredFavorites.map((property) => (
              <Marker
                key={property.propertyId}
                coordinate={{ latitude: property.latitude, longitude: property.longitude }}
                onPress={() => {
                  // Navigate to the PropertyListing screen with the propertyListingId
                  navigation.navigate('Property Listing', { propertyListingId: property.propertyListingId });
                }}
              >
                <Callout>
                  <Text>{property.title}</Text>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => (item.propertyId ?? 'defaultKey').toString()}
          renderItem={({ item }) => {
            return isSquareLayout ? (
              <PropertyCardUser
                property={item}
                onPress={() =>
                  navigation.navigate('Property Listing', { propertyListingId: item.propertyListingId })
                }
                onFavoritePress={handleFavoritePress}
              />
            ) : (
              <PropertyCardRectangle
                property={item}
                onPress={() =>
                  navigation.navigate('Property Listing', { propertyListingId: item.propertyListingId })
                }
                onFavoritePress={handleFavoritePress}
              />
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 1,
    padding: 2,
    marginRight: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
  },
  toggleLabel: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  toggleMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#52b69a',
    borderRadius: 10,
    padding: 6,
    marginRight: 10,
  },
  toggleMapButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  map: {
    height: 300, // Adjust the map height as needed
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
});

export default UserListings;
