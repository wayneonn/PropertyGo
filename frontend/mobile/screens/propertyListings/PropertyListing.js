import React, { useEffect, useState, useContext } from 'react';
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
import { Entypo, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; // New imports for icons
import { getPropertyListing, getImageUriById, getUserById, addFavoriteProperty, removeFavoriteProperty, isPropertyInFavorites, countUsersFavoritedProperty } from '../../utils/api';
import base64 from 'react-native-base64';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import DefaultImage from '../../assets/No-Image-Available.webp';

const PropertyListingScreen = ({ route }) => {
  const { propertyListingId } = route.params;
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [propertyListing, setPropertyListing] = useState(null);
  const [userDetails, setUser] = useState(null);
  const { user } = useContext(AuthContext);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const isCurrentUserPropertyOwner = userDetails && userDetails.userId === user.user.userId;
  const [region, setRegion] = useState({
    latitude: 1.36922522142582,
    longitude: 103.848493192474,
    latitudeDelta: 0.005, // Adjust initial zoom level
    longitudeDelta: 0.005,
  });

  // Fetch the number of users who have favorited the property
  const fetchFavoriteCount = async () => {
    const { success, data, message } = await countUsersFavoritedProperty(propertyListingId);
    console.log('countUsersFavoritedProperty:', success, data, message);
    if (success) {
      setFavoriteCount(data.count); // Assuming the count is in data.count
    } else {
      console.error('Error fetching favorite count:', message);
    }
  };

  const fetchUser = async (userId) => {
    console.log('Fetching user with ID:', userId);
    const { success, data, message } = await getUserById(userId);

    if (success) {
      // Handle the user data here
      console.log('User Data:', data);
      return data;
    } else {
      // Handle the error here
      console.error('Error fetching user:', message);
    }
  };

  useEffect(() => {
    // Fetch property listing details including image IDs using propertyListingId from your API
    // Make an API call to retrieve the property details
    console.log('Received propertyListingId:', propertyListingId);
    fetchPropertyListing(propertyListingId);
    checkIfPropertyIsFavorite();
    fetchFavoriteCount();
    console.log('User:', user);
  }, [propertyListingId, user.user.userId]);

  const checkIfPropertyIsFavorite = async () => {
    const userId = user.user.userId;
    // Check if the property is in favorites and update the isFavorite state
    const { success, data, message } = await isPropertyInFavorites(
      userId, // Pass the user ID
      propertyListingId // Pass the property ID
    );

    console.log('isPropertyInFavorites:', success, data, message);

    if (success) {
      setIsFavorite(data.isLiked);
    } else {
      console.error('Error checking if property is in favorites:', message);
    }
  };

  const handleFavoriteButtonPress = async () => {
    if (isFavorite) {
      // Remove the property from favorites
      const { success, message } = await removeFavoriteProperty(
        userDetails.userId, // Pass the user ID
        propertyListingId // Pass the property ID
      );

      if (success) {
        setIsFavorite(false);
        setFavoriteCount((prevCount) => prevCount - 1);
      } else {
        console.error('Error removing property from favorites:', message);
      }
    } else {
      // Add the property to favorites
      const { success, message } = await addFavoriteProperty(
        userDetails.userId, // Pass the user ID
        propertyListingId // Pass the property ID
      );

      if (success) {
        setIsFavorite(true);
        setFavoriteCount((prevCount) => prevCount + 1);
      } else {
        console.error('Error adding property to favorites:', message);
      }
    }
  };

  const fetchPropertyListing = async (id) => {
    try {
      // Make an API call to fetch property listing details by id
      const response = await fetch(getPropertyListing(id));
      const data = await response.json();
      const userDetailsData = await fetchUser(data.userId);
      setUser(userDetailsData); // Update user details state
      setPropertyListing(data); // Update state with the fetched data
      // Fetch latitude and longitude based on postal code
      fetchLatitudeLongitudeByPostalCode(data.postalCode);
      console.log('Property Listing Data:', data)
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
            latitudeDelta: 0.005, // Adjust these values for initial zoom level
            longitudeDelta: 0.005,
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

  let profileImageBase64;
  if (userDetails && userDetails.profileImage && userDetails.profileImage.data) {
    profileImageBase64 = base64.encodeFromByteArray(userDetails.profileImage.data);
  }

  const formatPriceWithCommas = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatPricePerSqm = (price, size) => {
    if (price !== null && size !== null && !isNaN(price) && !isNaN(size) && size !== 0) {
      const pricePerSqm = (price / size).toFixed(2); // Format to 2 decimal places
      return pricePerSqm;
    } else {
      return 'N/A'; // Handle the case when price or size is null, undefined, or 0
    }
  };


  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <Swiper style={styles.wrapper} showsButtons={false} loop={false} autoplay={true} autoplayTimeout={5}>
            {propertyListing.images.length > 0 ? (
              propertyListing.images.map((imageId, index) => {
                const imageUri = getImageUriById(imageId);
                return (
                  <View key={index} style={styles.slide}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  </View>
                );
              })              
            ) : (
              <View style={styles.slide}>
                <Image
                  source={DefaultImage} // Use the placeholder image here
                  style={styles.image}
                />
              </View>
            )}
          </Swiper>


          {/* Add your square boxes for images here. You might need another package or custom UI for this. */}
        </View>

        <View style={styles.propertyDetailsTop}>
          <View style={styles.propertyDetailsTopLeft}>
            <Text style={styles.forSaleText}>For Sales</Text>
            <Text style={styles.title}>{propertyListing.title}</Text>
            <Text style={styles.priceLabel}>${formatPriceWithCommas(propertyListing.price)}</Text>
            <Text style={styles.pricePerSqm}>
              ${formatPricePerSqm(propertyListing.price, propertyListing.size)} psm{' '}
            </Text>
            <Text style={styles.roomsAndSize}>
              {propertyListing.bed} <Ionicons name="bed" size={16} color="#333" />  |
              {'  '}{propertyListing.bathroom} <Ionicons name="water" size={16} color="#333" />  |
              {'  '}{propertyListing.size} sqm  <Ionicons name="cube-outline" size={16} color="#333" /> {/* Added cube icon */}
            </Text>
          </View>

          <View style={styles.propertyDetailsTopRight}>
            <View style={styles.favoriteButtonContainer}>
              <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteButtonPress}>
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? 'red' : '#333'} />
              </TouchableOpacity>
              <Text style={{ color: isFavorite ? 'red' : '#333', marginRight: 6, marginTop: -12, fontSize: 16, fontWeight: 'bold' }}>{favoriteCount}</Text>
            </View>
            {userDetails && (
              <View style={styles.userInfoContainer}>
                <TouchableOpacity
                  onPress={() => {
                    if (userDetails) {
                      navigation.navigate('View Profile', { userId: userDetails.userId }); // Pass the userId parameter
                    }
                  }}
                >
                  {profileImageBase64 ? (
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${profileImageBase64}` }}
                      style={styles.userProfileImage}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/Default-Profile-Picture-Icon.png')}
                      style={styles.userProfileImage}
                    />
                  )}
                </TouchableOpacity>
                {/* <Text style={styles.userName}>{userDetails?.name}</Text> */}
              </View>
            )}
          </View>
        </View>

        <Text style={styles.descriptionHeader}>Description:</Text>
        <Text style={styles.description}>{propertyListing.description}</Text>

        {/* Location Details */}
        <Text style={styles.locationTitle}>Location</Text>
        <Text style={styles.locationDetails}>{propertyListing.address}</Text>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={region}>
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
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
              console.log("This is the line: ", userDetails)
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

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        {isCurrentUserPropertyOwner ? (
          <>
            <TouchableOpacity style={styles.bumpListingButton}>
              <Text style={styles.buttonText}>Bump Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editListingButton}>
              <Text style={styles.buttonText}>Edit Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteListingButton}>
              <Text style={styles.buttonText}>Delete Listing</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.chatWithSellerButton}>
              <Text style={styles.buttonText}>Chat With Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewScheduleButton}>
              <Text style={styles.buttonText}>View Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buttonText}>Buy</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

    </View>
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
    resizeMode: 'cover', // Use 'cover' for better image fitting
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
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignContent: 'center',
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingLeft: 16, // Add left padding for better alignment
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 16,
    marginBottom: 10,
  },
  description: {
    paddingLeft: 16,
    marginBottom: 20,
  },

  // Styles for fixed bottom buttons
  bottomButtonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    justifyContent: 'space-between', // Added for spacing between buttons
    paddingHorizontal: 10, // Padding to give space from the screen edge
  },

  chatWithSellerButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white', // Choose your color
    alignItems: 'center',
    borderWidth: 1,       // Add border
    borderColor: '#000',  // Border color
    borderRadius: 10,     // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },

  viewScheduleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white', // Choose your color
    alignItems: 'center',
    borderWidth: 1,       // Add border
    borderColor: '#000',  // Border color
    borderRadius: 10,     // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },

  buyButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFD700', // Yellow color
    alignItems: 'center',
    borderWidth: 1,        // Add border
    borderColor: '#000',   // Border color
    borderRadius: 10,      // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },
  bumpListingButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white', // Choose your color
    alignItems: 'center',
    borderWidth: 1,       // Add border
    borderColor: '#000',  // Border color
    borderRadius: 10,     // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },

  editListingButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white', // Choose your color
    alignItems: 'center',
    borderWidth: 1,       // Add border
    borderColor: '#000',  // Border color
    borderRadius: 10,     // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },

  deleteListingButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFD700', // Yellow color
    alignItems: 'center',
    borderWidth: 1,        // Add border
    borderColor: '#000',   // Border color
    borderRadius: 10,      // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },

  buttonText: {
    fontSize: 12,
    color: '#000',           // Black text color for all buttons
  },

  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  // For the top property details
  propertyDetailsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  propertyDetailsTopLeft: {
    flex: 3,
  },
  propertyDetailsTopRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  forSaleText: {
    fontSize: 20,
    color: '#333',
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    color: '#333',
    letterSpacing: 2,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },
  favoriteButton: {
    marginRight: 10,
    paddingBottom: 10,
  },
  locationDetails: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  favoriteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});

export default PropertyListingScreen;
