import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getTimeAgo } from '../../services/CalculateTimeAgo';

const ForumItemHeader = ({ topicName, updatedAt, onMoreOptionsPress, postId }) => {
  return (
    <View style={styles.forumItem}>
      <View style={styles.headerContainer}>
        <Text style={postId ? styles.topicName : styles.topicNameBig}>{topicName}</Text>
        <Text style={styles.updatedAt}>{getTimeAgo(updatedAt)}</Text>
      </View>
      <TouchableOpacity onPress={onMoreOptionsPress}>
        <FontAwesome name="ellipsis-h" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({

    forumItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        // marginBottom:5,
        paddingHorizontal: 16,
        borderBottomColor: '#ccc',
        // borderBottomWidth: 1,
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      topicName: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      topicNameBig: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      updatedAt: {
        fontSize: 10,
        color: 'gray',
        marginLeft: 5,
      },
})

export default ForumItemHeader;