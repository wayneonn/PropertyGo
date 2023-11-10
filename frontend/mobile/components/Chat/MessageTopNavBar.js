import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MessageTopNavBar = () => {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <TouchableOpacity onPress={handleBackButtonPress}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.middleContent}>
        <Text style={styles.pageTitle}>Chat</Text>
      </View>
      <View style={styles.rightContent}>
        {/* Add any content for the right side */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    elevation: 5,
    backgroundColor: 'white', // Set the background color of the header
  },
  leftContent: {
    flex: 1,
  },
  middleContent: {
    flex: 2, // Adjust the flex value to control the alignment of the title
    alignItems: 'center',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end', // Align content to the right
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default MessageTopNavBar;
