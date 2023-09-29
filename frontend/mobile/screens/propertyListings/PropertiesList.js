import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import PropertyCard from '../propertyListings/PropertyCard';
import PropertyCardRectangle from '../propertyListings/PropertyCardRectangle';
import { Ionicons } from '@expo/vector-icons';

const PropertiesList = ({ route }) => {
  const { title, properties, navigation } = route.params;
  const [searchText, setSearchText] = useState('');
  const [isSquareLayout, setIsSquareLayout] = useState(true);

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCardLayout = () => {
    setIsSquareLayout((prevIsSquareLayout) => !prevIsSquareLayout);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by property title"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCardLayout}>
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

export default PropertiesList;
