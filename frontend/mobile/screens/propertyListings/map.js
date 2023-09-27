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
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Custom marker info window component
const CustomMarkerInfoWindow = ({ title }) => {
  return (
    <View style={styles.infoWindowContainer}>
      <Text style={styles.infoWindowTitle}>Address:</Text>
      <Text style={styles.infoWindowText}>{title}</Text>
    </View>
  );
};

const PropertyListingScreen = ({ route }) => {
  const [propertyListing, setPropertyListing] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 1.39454889110377,
    longitude: 103.911106168329,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerTitle, setMarkerTitle] = useState("Marker Label");

  const idNumber = 10;

  useEffect(() => {
    fetchPropertyListing(idNumber);
  }, [idNumber]);

  const fetchPropertyListing = async () => {
    try {
      const response = await fetch(`http://localhost:3000/property/10`);
      const data = await response.json();

      setPropertyListing(data);
      setMarkerTitle(data.address);
    } catch (error) {
      console.error('Error fetching property listing:', error);
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
                source={{ uri: `http://localhost:3000/image/${image.imageId}` }}
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
        // provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion}
        >
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
          >
            <Callout tooltip>
              <CustomMarkerInfoWindow title={markerTitle} />
            </Callout>
          </Marker>
        </MapView>
      </View>

      <View style={styles.zoomButtonContainer}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            const zoomInRegion = {
              ...mapRegion,
              latitudeDelta: mapRegion.latitudeDelta / 2,
              longitudeDelta: mapRegion.longitudeDelta / 2,
            };
            setMapRegion(zoomInRegion);
          }}
        >
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            const zoomOutRegion = {
              ...mapRegion,
              latitudeDelta: mapRegion.latitudeDelta * 2,
              longitudeDelta: mapRegion.longitudeDelta * 2,
            };
            setMapRegion(zoomOutRegion);
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
    width: '90%',
    height: '90%',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  zoomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 16,
  },
  zoomButton: {
    backgroundColor: 'grey',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginTop: -18,
    borderRadius: 10, // Make the button round
  },
  infoWindowContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    width: 200, // Adjust the width as needed
  },
  infoWindowTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  infoWindowText: {
    fontSize: 12,
    width: '100%', // Ensure text wraps within the container
  },
  
});

export default PropertyListingScreen;
