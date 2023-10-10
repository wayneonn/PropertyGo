import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const SearchBar = ({ handleSearch, searchQuery }) => {

    return (
        <View style={styles.searchBarContainer}>
            <TextInput
                placeholder="Search"
                style={styles.searchBar}
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <AntDesign
                name="search1" // Change this to your preferred search icon
                size={20} // Adjust the size as needed
                color="gray" // Adjust the color as needed
                style={styles.searchIcon}
            />
        </View>
    )

}

const styles = StyleSheet.create({

    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom:10,
    },
    searchBar: {
        flex: 1,
        height: 40,
    },
    searchIcon: {
        marginLeft: 10, // Adjust the margin as needed
        color: "#ccc"
    },

})
export default SearchBar