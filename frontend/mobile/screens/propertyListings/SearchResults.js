import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';
import PropertyCard from '../propertyListings/PropertyCard';
import PropertyCardRectangle from '../propertyListings/PropertyCardRectangle';
import { searchProperties } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout } from 'react-native-maps';

const SearchResults = ({ route, navigation }) => {
    const { searchQuery } = route.params;
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isSquareLayout, setIsSquareLayout] = useState(true);
    const [isMapVisible, setIsMapVisible] = useState(false); // State variable to track map visibility

    const initialRegion = {
        latitude: 1.361588, // Default to West Area Properties coordinates
        longitude: 103.805249,
        latitudeDelta: 0.35,
        longitudeDelta: 0.35,
    };

    useEffect(() => {
        // Fetch search results when the screen loads
        fetchSearchResults();
    }, []);

    useEffect(() => {
        // Fetch search suggestions when inputValue changes
        fetchSuggestions(inputValue);
    }, [inputValue]);

    const fetchSearchResults = async () => {
        try {
            const { success, data } = await searchProperties(searchQuery);

            if (success) {
                setSearchResults(data);
            } else {
                console.error('Error fetching search results:', data.message);
            }
        } catch (error) {
            console.error('Error fetching search results:', error.message);
        }
    };

    const fetchSuggestions = async (query) => {
        try {
            const { success, data } = await searchProperties(query);

            if (success) {
                setSuggestions(data.slice(0, 10)); // Limit suggestions to 10 items
            } else {
                console.error('Error fetching search suggestions:', data.message);
            }
        } catch (error) {
            console.error('Error fetching search suggestions:', error.message);
        }
    };

    const handleSuggestionClick = (item) => {
        setInputValue(item.address);
        setSuggestions([]); // Clear suggestions
        fetchSearchResults(); // Trigger search when the suggestion is clicked
    };

    const handlePropertyPress = (propertyListingId) => {
        // Navigate to the Property Listing screen with the given propertyListingId
        navigation.navigate('Property Listing', { propertyListingId });
    };

    const toggleCardLayout = () => {
        setIsSquareLayout((prevIsSquareLayout) => !prevIsSquareLayout);
    };

    const toggleMapView = () => {
        setIsMapVisible((prevIsMapVisible) => !prevIsMapVisible);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Search Page</Text>
                </View>
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder="Enter Postal Code/MRT Address/District"
                        style={styles.searchInput}
                        onChangeText={(text) => {
                            setInputValue(text);
                            if (text.trim() === '') {
                                setSuggestions([]);
                            } else {
                                if (searchTimeout) {
                                    clearTimeout(searchTimeout);
                                }
                                const timeout = setTimeout(() => {
                                    fetchSuggestions(text);
                                }, 500);
                                setSearchTimeout(timeout);
                            }
                        }}
                        value={inputValue} // Display the inputValue here
                    />
                    <TouchableOpacity style={styles.searchIconContainer} onPress={fetchSearchResults}>
                        <Image
                            source={require('../../assets/Top-Navbar-Icons/search-icon.png')}
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Suggestions */}
                {suggestions.length > 0 && inputValue.trim() !== '' && (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.suggestionItem,
                                    index === suggestions.length - 1 && styles.suggestionItemLast,
                                ]}
                                onPress={() => handleSuggestionClick(item)}
                            >
                                <Text style={styles.suggestionText}>{item.address}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.toggleButtonContainer}>
                    <TouchableOpacity style={styles.toggleMapButton} onPress={toggleMapView}>
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

                    <TouchableOpacity style={styles.toggleButton} onPress={toggleCardLayout}>
                        <Text>
                            <Ionicons
                                name={isSquareLayout ? 'list' : 'grid'}
                                size={24}
                                color="#333"
                            />
                            <View style={[marginBottom = 5]}>
                                <Text style={[styles.toggleLabel]}>
                                    {' '}{isSquareLayout ? 'List' : 'Grid'}
                                </Text>
                            </View>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Conditionally render the MapView based on isMapVisible */}
                {isMapVisible && (
                    <MapView style={styles.map} initialRegion={initialRegion}>
                        {searchResults.map((property) => (
                            <Marker
                                key={property.propertyId}
                                coordinate={{
                                    latitude: property.latitude,
                                    longitude: property.longitude,
                                }}
                                onPress={() => handlePropertyPress(property.propertyListingId)}
                            >
                                <Callout>
                                    <Text>{property.address}</Text>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                )}

                <Text style={styles.title}>Search Results for "{searchQuery}"</Text>
                {searchResults.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>No search results found</Text>
                    </View>
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) =>
                            (item.propertyId ?? 'defaultKey').toString()
                        }
                        renderItem={({ item }) => {
                            return isSquareLayout ? (
                                <PropertyCard
                                    property={item}
                                    onPress={() => handlePropertyPress(item.propertyListingId)}
                                />
                            ) : (
                                <PropertyCardRectangle
                                    property={item}
                                    onPress={() => handlePropertyPress(item.propertyListingId)}
                                />
                            );
                        }}
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 10,
        alignContent: 'center',
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
    suggestionsContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        position: 'absolute', // Position suggestions above other content
        zIndex: 1, // Ensure suggestions are on top
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    suggestionItemLast: {
        borderBottomWidth: 0,
    },
    suggestionText: {
        fontSize: 14,
    },
    noResultsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: 'gray',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 120,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        top: 1, // Adjust the top position as needed
        left: 16, // Adjust the left position as needed
        zIndex: 1, // Place it above the swiper
    },
    toggleButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginBottom: 10,
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
        height: 300, // Adjust the map height as needed
    },
    toggleMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#52b69a',
        borderRadius: 10,
        padding: 6,
        marginRight: 10,
    },
    toggleLabel: {
        marginLeft: 0,
        fontSize: 16,
        color: '#333',
    },
    toggleButton: {
        alignItems: 'flex-end',
        marginBottom: 5,
        marginRight: 5,
    },
});

export default SearchResults;
