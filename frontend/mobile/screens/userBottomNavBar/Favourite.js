import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCard';
import PropertyCardRectangle from '../propertyListings/PropertyCardRectangle';
import { getUserFavorites, removeFavoriteProperty, isPropertyInFavorites } from '../../utils/api';
import { AuthContext } from '../../AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const Favourite = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSquareLayout, setIsSquareLayout] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchFavorites = async () => {
    const userId = user.user.userId;
    const { success, data } = await getUserFavorites(userId);
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

  // Use useFocusEffect to refresh the screen when it gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Properties</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by property title"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleCardLayout}
      >
        <View style={styles.toggleContainer}>
          <Ionicons
            name={isSquareLayout ? 'list' : 'grid'}
            size={24}
            color="#333"
          />
          <Text style={styles.toggleLabel}>
            {isSquareLayout ? 'List' : 'Grid'}
          </Text>
        </View>
      </TouchableOpacity>
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => (item.propertyId ?? 'defaultKey').toString()}
        renderItem={({ item }) => {
          console.log("This is the item: ", item); // Add this line for debugging
          return isSquareLayout ? (
            <PropertyCard
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
    marginBottom: 20,
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
    alignItems: 'flex-end',
    marginBottom: 10,
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
});

export default Favourite;
