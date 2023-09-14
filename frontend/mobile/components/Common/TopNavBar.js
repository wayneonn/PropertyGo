import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';

const TopBar = () => {
    return (
      <View style={styles.topBar}>
        {/* Hamburger Icon */}
        <TouchableOpacity onPress={() => { /* Navigate to different sections */ }}>
          <Image source={require('../../assets/Top-Navbar-Icons/hamburger-icon.png')} style={styles.hamburgerIcon} />
        </TouchableOpacity>
  
        {/* Center Icon */}
        <Image source={require('../../assets/PropertyGo-Logo.png')} style={styles.centerIcon} />
  
        {/* Token and Chat Icons */}
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => { /* Navigate to token transactions */ }} style={styles.centeredContainer}>
            <Image source={require('../../assets/Top-Navbar-Icons/token-icon.png')} style={styles.tokenIcon} />
            <Text style={styles.tokenText}>100 Tokens</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Navigate to chat page */ }}>
            <Image source={require('../../assets/Top-Navbar-Icons/chat-icon.png')} style={styles.chatIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
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
        padding : 5,
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