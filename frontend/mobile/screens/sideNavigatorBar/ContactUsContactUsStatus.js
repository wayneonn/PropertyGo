import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';

const DATA = [
  {
    id: '1',
    title: 'Enquiry 1',
    reason: 'General Inquiry',
    message: 'This is a general inquiry message.',
    status: 'Replied',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Enquiry 2',
    reason: 'Feedback',
    message: 'This is a feedback message.',
    status: 'Replied',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    title: 'Enquiry 3',
    reason: 'Technical Support',
    message: 'This is a technical support message.',
    status: 'Closed',
    timestamp: '3 days ago',
  },
  // Add more data items as needed
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'yellow';
    case 'Replied':
      return 'green';
    case 'Closed':
      return 'red';
    default:
      return 'gray';
  }
};

const BoxItem = ({ title, reason, message, status, timestamp }) => (
  <View style={styles.box}>
    <View style={styles.leftBox}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.reasonText}>{reason}</Text>
      <Text style={styles.messageText}>{message}</Text>
    </View>
    <View style={styles.rightBox}>
      {/* <View
        style={[
          styles.statusIcon,
          {
            backgroundColor: getStatusColor(status),
          },
        ]}
      />
      <Text style={[styles.statusText, {color: getStatusColor(status)}]}>{status}</Text> */}
      <Text style={styles.timestampText}>{timestamp}</Text>
    </View>
  </View>
);

const ContactUsStatus = ({ navigation }) => {
  const pendingData = DATA.filter((item) => item.status === 'Pending');
  const repliedData = DATA.filter((item) => item.status === 'Replied');
  const closedData = DATA.filter((item) => item.status === 'Closed');

  const renderEmptyListComponent = () => (
    <Text style={styles.emptyListText}>You have no enquiry here!</Text>
  );
  const renderStatusSection = (title, data) => (
    <View style={styles.statusSection}>
      <Text style={styles.statusHeader}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <BoxItem {...item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyListComponent} // Show message when empty
        style={styles.flatListBorder}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ContactUs Status</Text>

      {renderStatusSection('Pending', pendingData)}
      {renderStatusSection('Replied', repliedData)}
      {renderStatusSection('Closed', closedData)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFD700',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusSection: {
    marginBottom: 16,
  },
  flatListBorder: {
    // borderWidth: 1,
    borderColor: 'your-border-color-here', // Add the desired border color
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statusHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor:"white",
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
    fontSize: 16,
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 12,
    color: '#888888',
  },
});

export default ContactUsStatus;
