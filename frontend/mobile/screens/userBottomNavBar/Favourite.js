import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCard'; // Import the PropertyCard component
import {
  getUserFavorites,
  removeFavoriteProperty,
  isPropertyInFavorites,
} from '../../utils/api';
import { AuthContext } from '../../AuthContext';

const Favourite = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Access the user context within the functional component
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    // Fetch user's favorite properties
    const userId = user.user.userId; // Replace with the user's actual ID
    console.log('userId:', userId);
    const { success, data } = await getUserFavorites(userId);
    console.log('data:', data);

    if (success) {
      // Check if each property is in favorites and update the isFavorite property
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
    const userId = user.user.userId; // Replace with the user's actual ID

    // Remove or add property to favorites
    const property = favorites.find((p) => p.propertyId === propertyId);
    if (property) {
      const { success } = await removeFavoriteProperty(userId, propertyId);
      if (success) {
        // Update the isFavorite property in the local state
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by property title"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => (item.propertyId ?? 'defaultKey').toString()}
        renderItem={({ item }) => {
          console.log("This is the item: ",item); // Add this line for debugging
          return (
            <PropertyCard
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default Favourite;
