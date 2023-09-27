import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper';

const PropertyListingScreen = ({ route }) => {
  const { propertyListingId } = route.params;
  const [propertyListing, setPropertyListing] = useState(null);

  useEffect(() => {
    // Fetch property listing details including image IDs using propertyListingId from your API
    // Make an API call to retrieve the property details
    fetchPropertyListing(propertyListingId);
  }, [propertyListingId]);

  const fetchPropertyListing = async (id) => {
    try {
      // Make an API call to fetch property listing details by id
      const response = await fetch(`http://localhost:3000/property/${id}`);
      const data = await response.json();

      setPropertyListing(data); // Update state with the fetched data
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
                source={{ uri: `http://localhost:3000/image/${image.imageId}` }} // Replace with your image route
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
        {/* Add more property details here */}
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
});

export default PropertyListingScreen;
