import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, TextInput,Text } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ForumTopNavBar = () => {
    const navigation = useNavigation();

    const handleBackButtonPress = () => {

        // const currentRouteName = route.name;
        // console.log(currentRouteName)
        navigation.goBack();
      };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleBackButtonPress}>
                <Ionicons name="arrow-back" size={26} color="black" />
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Forum</Text>

            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.HamburgerIcon}>
                <AntDesign name="menu-unfold" size={26} color="black" />
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 5,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        elevation: 5,
        backgroundColor: 'white', // Set the background color of the header
        // borderWidth:3,
    },
    pageTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    HamburgerIcon: {
        marginRight: 5,
    },
    logoContainer: {
        flex: 1,
        // justifyContent: 'center', // Center horizontally,
        marginBottom: 5,
        // borderWidth: 1,
    },
    logo: {
        alignItems: 'center',
    },
    logoImage: {
        width: 45,
        height: 45,
        // marginBottom: 3,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        justifyContent: 'space-between', // Add this line
    },
});

export default ForumTopNavBar;
