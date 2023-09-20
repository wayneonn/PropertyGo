import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const TopBar = () => {

  const navigation = useNavigation();

  // Screen-specific header options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10, marginBottom: 5 }}>
          <AntDesign name="menu-unfold" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={require('../../assets/PropertyGo-Logo.png')}
            style={{ width: 45, height: 45, marginBottom: 5 }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              /*side nav bar*/
            }}
            style={{ marginRight: 15, marginBottom: 5 }}
          >
            <FontAwesome5 name="coins" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              /*side nav bar*/
            }}
            style={{ marginRight: 10, marginBottom: 5 }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);


  return null;
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 0.2, // Add a border line at the bottom
    borderBottomColor: '#000',
  },
  centeredContainer: {
    flexDirection: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcon: {
    width: 30,
    height: 30,
  },
  tokenText: {
    fontSize: 10,
    padding: 5,
    textAlign: 'center',
  },
  hamburgerIcon: {
    width: 30,
    height: 30,
  },
  centerIcon: {
    position: 'absolute',
    left: '50%',
    marginLeft: -15, // half of your icon width
    width: 50,
    height: 50,
  },
  chatIcon: {
    marginLeft: 10,
    width: 30,
    height: 30,
    marginBottom: 10,
  },
});

export default TopBar;