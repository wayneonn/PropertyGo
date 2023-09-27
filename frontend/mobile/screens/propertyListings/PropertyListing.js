import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PropertyListingScreen = ({ route }) => {
  const { propertyListingId } = route.params;
  const [propertyListing, setPropertyListing] = useState(null);

  useEffect(() => {
    // Fetch property listing details using propertyListingId from your API
    // You can make an API call here to retrieve the property details
    // and update the state with the fetched data
    // For example, you can use the propertyListingId to fetch the data

    // Replace the following example with your actual API call
    fetchPropertyListing(propertyListingId);
  }, [propertyListingId]);

  const fetchPropertyListing = async (id) => {
    try {
      // Make an API call to fetch property listing details by id
      // For example:
      const response = await fetch(`YOUR_API_ENDPOINT/${id}`);
      const data = await response.json();

      setPropertyListing(data); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching property listing:', error);
    }
  };

  if (!propertyListing) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{propertyListing.title}</Text>
      <Image
        source={{ uri: propertyListing.imageUrl }} // Replace with your image URL
        style={styles.image}
      />
      {/* Display other property listing details here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  // Add styles for other property details here
});

export default PropertyListingScreen;
