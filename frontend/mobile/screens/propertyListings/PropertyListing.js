import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getPropertyListing, getImageUriById } from '../../utils/api';

const PropertyListingScreen = ({ route }) => {
  const { propertyListingId } = route.params;
  const [propertyListing, setPropertyListing] = useState(null);
  const [region, setRegion] = useState({
    latitude: 1.36922522142582, // Default latitude
    longitude: 103.848493192474, // Default longitude
    latitudeDelta: 0.003, // Adjust these values for initial zoom level
    longitudeDelta: 0.003,
  });

  useEffect(() => {
    // Fetch property listing details including image IDs using propertyListingId from your API
    // Make an API call to retrieve the property details
    fetchPropertyListing(propertyListingId);
  }, [propertyListingId]);

  const fetchPropertyListing = async (id) => {
    try {
      // Make an API call to fetch property listing details by id
      const response = await fetch(getPropertyListing(id));
      const data = await response.json();

      setPropertyListing(data); // Update state with the fetched data
      // Fetch latitude and longitude based on postal code
      fetchLatitudeLongitudeByPostalCode(data.postalCode);
    } catch (error) {
      console.error('Error fetching property listing:', error);
    }
  };

  const fetchLatitudeLongitudeByPostalCode = async (postalCode) => {
    try {
      // Make an API call to fetch latitude and longitude based on postal code
      const response = await fetch(
        `https://developers.onemap.sg/commonapi/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.found === 1) {
          // Extract the latitude and longitude from the API response
          const latitude = parseFloat(data.results[0].LATITUDE);
          const longitude = parseFloat(data.results[0].LONGITUDE);

          // Update the region state with obtained values
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.003, // Adjust these values for initial zoom level
            longitudeDelta: 0.003,
          });
        } else {
          console.error('No address found for the postal code.');
        }
      } else {
        console.error('API request failed.');
      }
    } catch (error) {
      console.error('Error fetching latitude and longitude:', error);
    }
  };

  if (!propertyListing) {
    return <ActivityIndicator style={styles.loadingIndicator} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageGallery}>
        <Swiper style={styles.wrapper} showsButtons={false}>
          {propertyListing.images.map((image, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={{ uri: getImageUriById(image.imageId) }}
                style={styles.image}
              />
            </View>
          ))}
        </Swiper>
      </View>

      <View style={styles.propertyDetails}>
        <Text style={styles.title}>{propertyListing.title}</Text>
        <Text style={styles.description}>{propertyListing.description}</Text>
        <Text style={styles.label}>Bed: {propertyListing.bed}</Text>
        <Text style={styles.label}>Bathroom: {propertyListing.bathroom}</Text>
        <Text style={styles.label}>Price: ${propertyListing.price}</Text>
        <Text style={styles.label}>Address: {propertyListing.address}</Text>
        <Text style={styles.label}>Postal Code: {propertyListing.postalCode}</Text>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.title}>Location</Text>
        <MapView
          style={styles.map}
          region={region} // Use the region state here
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            }}
          >
            <Callout>
              <View style={styles.infoWindowContainer}>
                <Text style={styles.infoWindowTitle}>Address:</Text>
                <Text style={styles.infoWindowText}>{propertyListing.address}</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      </View>

      <View style={styles.zoomButtonContainer}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            // Zoom in by decreasing the latitudeDelta and longitudeDelta
            const zoomInRegion = {
              ...region,
              latitudeDelta: region.latitudeDelta / 2,
              longitudeDelta: region.longitudeDelta / 2,
            };
            setRegion(zoomInRegion);
          }}
        >
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            // Zoom out by increasing the latitudeDelta and longitudeDelta
            const zoomOutRegion = {
              ...region,
              latitudeDelta: region.latitudeDelta * 2,
              longitudeDelta: region.longitudeDelta * 2,
            };
            setRegion(zoomOutRegion);
          }}
        >
          <Ionicons name="remove-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGallery: {
    height: 300,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  propertyDetails: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: 300,
  },
  mapContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  zoomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    paddingBottom: 16,
  },
  zoomButton: {
    backgroundColor: 'grey',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  infoWindowContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  infoWindowTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  infoWindowText: {
    fontSize: 12,
    width: '100%',
  },
});

export default PropertyListingScreen;
