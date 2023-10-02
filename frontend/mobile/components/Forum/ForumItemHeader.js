import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { getTimeAgo } from '../../services/CalculateTimeAgo';

const ForumItemHeader = ({ topicName, updatedAt, onMoreOptionsPress, postId, editable, onEdit }) => {
  return (
    <View style={styles.forumItem}>
      <View style={styles.headerContainer}>
        <Text style={postId ? styles.topicName : styles.topicNameBig}>{topicName}</Text>
        <Text style={styles.updatedAt}>{getTimeAgo(updatedAt)}</Text>
      </View>
      <View style={styles.rightHeaderContainer}>
        {editable ?
          <TouchableOpacity onPress={onEdit} style={{marginRight:10}}>
            <AntDesign name="edit" size={20} color="black" />
          </TouchableOpacity>
          :
          null}
        <TouchableOpacity onPress={onMoreOptionsPress}>
          <FontAwesome name="ellipsis-h" size={20} color="black" />
        </TouchableOpacity>
      </View>
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
  rightHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    justifyContent: 'flex-end', // Right-align items
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