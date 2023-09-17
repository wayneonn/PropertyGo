import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import TopBar from '../../components/Common/TopNavBar';

const Favourite = () => {
    return (
      <SafeAreaView >
        <TopBar/>
        <Text>FavouriteScreen</Text>
      </SafeAreaView>
    );
  };

  export default Favourite;