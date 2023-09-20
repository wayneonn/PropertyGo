import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTimeAgo } from '../services/CalculateTimeAgo';

const BoxItem = ({ parentTitleStatus, title, reason, message, createdAt, response }) => {
  const backgroundColor =
    parentTitleStatus === 'Replied'
      ? 'rgba(0, 255, 0, 0.1)'
      : 'rgba(255, 0, 0, 0.1)';

  return (
    <View style={{ ...styles.box, backgroundColor }}>
      <View style={styles.leftBox}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.reasonText}>{reason}</Text>
        <Text style={styles.messageText}><Text style={{ fontWeight: 'bold' }}>Description:</Text> {message}</Text>
        {response && (
          <Text style={styles.messageText}><Text style={{ fontWeight: 'bold' }}>Reply:</Text> {response}</Text>
        )}
      </View>
      <View style={styles.rightBox}>
        <Text style={styles.timestampText}>{getTimeAgo(createdAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  leftBox: {
    flex: 3,
  },
  rightBox: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reasonText: {
    fontSize: 14,
    color: '#888888',
  },
  messageText: {
    fontSize: 14,
    marginTop:5,
    
  },
  timestampText: {
    fontSize: 12,
    color: '#888888',
  },
});

export default BoxItem;
