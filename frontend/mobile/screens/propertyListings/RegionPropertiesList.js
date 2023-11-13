import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PropertyCard from './PropertyCard';
import PropertyCardRectangle from './PropertyCardRectangle';
import { Ionicons } from '@expo/vector-icons';
import { getPropertiesByRegion } from '../../utils/api';
import MapView, { Marker, Callout } from 'react-native-maps';

const RegionPropertiesList = ({ route }) => {
  const { title, navigation, region } = route.params;
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSquareLayout, setIsSquareLayout] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(false); // State variable to track map visibility

  useEffect(() => {
    console.log('region: ', region)
    loadPropertiesByRegion(region);
  }, []);

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCardLayout = () => {
    setIsSquareLayout((prevIsSquareLayout) => !prevIsSquareLayout);
  };

  const toggleMapView = () => {
    setIsMapVisible((prevIsMapVisible) => !prevIsMapVisible);
  };

  const loadPropertiesByRegion = async (region) => {
    try {
      const { success, data } = await getPropertiesByRegion(region);

      if (success) {
        const top10Properties = data
        .sort((a, b) => b.favoriteCount - a.favoriteCount)
        .slice(0, 10);
        setProperties(data);
        console.log(`Properties in ${region}:`, data)
      } else {
        console.error(`Error loading properties in ${region}:`, data.message);
      }
    } catch (error) {
      console.error(`Error loading properties in ${region}:`, error.message);
    }
  };

  const titleToCoordinates = {
    'East Area Properties': { latitude: 1.356030, longitude: 103.919735, latitudeDelta: 0.1, longitudeDelta: 0.1, },
    'North Area Properties': { latitude: 1.426543, longitude: 103.800656, latitudeDelta: 0.1, longitudeDelta: 0.1, },
    'West Area Properties': { latitude: 1.353783, longitude: 103.749164, latitudeDelta: 0.1, longitudeDelta: 0.1, },
    'North-East Area Properties': { latitude: 1.376619, longitude: 103.874284, latitudeDelta: 0.1, longitudeDelta: 0.1, },
    'Central Area Properties': { latitude: 1.300917, longitude: 103.821265, latitudeDelta: 0.1, longitudeDelta: 0.1, },
  };

  const initialRegion = titleToCoordinates[title] || {
    latitude: 1.361588, // Default to West Area Properties coordinates
    longitude: 103.805249,
    latitudeDelta: 0.35,
    longitudeDelta: 0.35,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search by property title"
          placeholderTextColor="gray"
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
            {filteredProperties.map((property) => (
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
          data={filteredProperties}
          keyExtractor={(item) => (item.propertyId ?? 'defaultKey').toString()}
          renderItem={({ item }) => {
            return isSquareLayout ? (
              <PropertyCard
                property={item}
                onPress={() => {
                  navigation.navigate('Property Listing', { propertyListingId: item.propertyListingId })
                }}
              />
            ) : (
              <PropertyCardRectangle
                property={item}
                onPress={() => {
                  navigation.navigate('Property Listing', { propertyListingId: item.propertyListingId })
                }}
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
  header: {
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 50,
    // alignSelf: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,
    textAlign: 'center',
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
    paddingRight: 10,
  },
  toggleLabel: {
    marginLeft: 5,
    marginBottom: 3,
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
    marginTop: 15,
    height: 300, // Adjust the map height as needed
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default RegionPropertiesList;
