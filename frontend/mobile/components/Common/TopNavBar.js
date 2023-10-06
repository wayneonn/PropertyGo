import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AntDesign, FontAwesome5, Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

const TopBar = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.HamburgerIcon}>
                <AntDesign name="menu-unfold" size={26} color="black"/>
            </TouchableOpacity>
            <View style={styles.logoContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.logo}>
                    <Image
                        source={require('../../assets/PropertyGo-Logo.png')}
                        style={styles.logoImage}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.iconsContainer}>
                <TouchableOpacity
                    onPress={() => {
                        // Handle your action here
                    }}
                    style={styles.coinIcon}
                >
                    <FontAwesome5 name="coins" size={26} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        // Handle your action here
                    }}
                    style={styles.icon}
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={26} color="black"/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 42,
        paddingBottom: 3,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        elevation: 5,
        backgroundColor: 'white', // Set the background color of the header
    },
    HamburgerIcon: {
        marginRight: 39,
    },
    coinIcon: {
        marginRight: 15,
        marginBottom: 5,
    },
    chatIcon: {
        marginBottom: 5,
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

export default TopBar;
