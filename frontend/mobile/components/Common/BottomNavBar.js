import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../Home/HomePage';

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  
    // const bottomBarItems = [
    //   { label: 'Home', icon: require('../../assets/Bottom-Navbar-Icons/home-icon.png'), screen: 'HomeScreen' },
    //   { label: 'Favorite', icon: require('../../assets/Bottom-Navbar-Icons/favourite-icon.png'), screen: 'FavoriteScreen' },
    //   { label: 'Sell', icon: require('../../assets/Bottom-Navbar-Icons/sell-icon.png'), screen: 'SellScreen' },
    //   { label: 'Forum', icon: require('../../assets/Bottom-Navbar-Icons/forum-icon.png'), screen: 'ForumScreen' },
    //   { label: 'Activity', icon: require('../../assets/Bottom-Navbar-Icons/activity-icon.png'), screen: 'ActivityScreen' },
    // ];
  
    return (
      // <View style={styles.bottomBar}>
      //   {bottomBarItems.map((item, index) => (
      //     <TouchableOpacity key={index} style={styles.bottomBarItem} onPress={() => navigation.navigate(item.screen)}>
      //       <Image source={item.icon} style={styles.bottomBarIcon} />
      //       <Text style={styles.bottomBarText}>{item.label}</Text>
      //     </TouchableOpacity>
      //   ))}
      // </View>

      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomePage} />
      </Tab.Navigator>

    );
  };

  const styles = StyleSheet.create({
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F5F5F5',
        position: 'absolute',
        padding: 20,
        bottom: 0,
        borderTopWidth: 0.2, // Add a border line at the bottom
        borderTopColor: '#000',
      },
      bottomBarItem: {
        alignItems: 'center',
        width: '20%',
      },
      bottomBarIcon: {
        width: 30,
        height: 30,
        marginBottom: 5,
      },
      bottomBarText: {
        fontSize: 12,
      },
  });

  export default BottomBar;