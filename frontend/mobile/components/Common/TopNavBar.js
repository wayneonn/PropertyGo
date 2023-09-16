import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const TopBar = ({ title, leftIconAction, coinAction, RightIcon }) => {

  const navigation = useNavigation();

  // Screen-specific header options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => leftIconAction}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="menu-unfold" size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {title ?
            <Text>title</Text>
            :
            <Image
              source={require('../assets/PropertyGo-Logo.png')}
              style={{ width: 40, height: 40, marginBottom: 20 }} // Adjust the width and height as needed
            />
          }
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              coinAction
            }}
            style={{ marginRight: 10 }} // Add right margin to create spacing
          >
            <FontAwesome5 name="coins" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              RightIcon
            }}
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