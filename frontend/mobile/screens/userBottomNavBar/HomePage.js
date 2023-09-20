import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import TopBar from '../../components/Common/TopNavBar';

// Search bar component
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

// Property listing component
const PropertyListing = ({ image, description, price, area, roomFeatures }) => {
  return (
    <View style={styles.propertyListing}>
      <Image source={{ uri: image }} style={styles.propertyImage} />
      <View style={styles.propertyDetails}>
        <Text style={styles.propertyDescription}>{description}</Text>
        <Text style={styles.propertyPrice}>{price}</Text>
        <Text style={styles.propertyArea}>{area}</Text>
        <Text style={styles.propertyRoomFeatures}>{roomFeatures}</Text>
      </View>
    </View>
  );
};

// Main home page component
const HomePage = ({ navigation }) => {


  return (
    <SafeAreaView >

      <SearchBar />

      {/* Main content image */}
      <Image source={require('../../assets/Home-Image.jpeg')} style={styles.mainContentImage} />

      {/* Popular and Recently Added Sections */}
      <View style={styles.sectionContainer}>
        {/* Replace with your property details */}
        <PropertyListing
          image="https://media.thepeakmagazine.com.sg/public/2019/04/luxury-homes-Singapore_Ta.Le-Architects_Ridout-Road_new.jpg?compress=true&quality=80&w=480&dpr=2.6"
          description="26 Ridout Road"
          price="$100,000,000"
          area="1000 sqft"
          roomFeatures="10 bedrooms, 3 bathrooms"
        />
      </View>

      {/* <BottomBar /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    height: '25%',
  },
  sectionContainer: {
    padding: 10,
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
});


export default HomePage;
