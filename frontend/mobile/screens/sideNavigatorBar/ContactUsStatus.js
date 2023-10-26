import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { getUserContactUs } from '../../utils/contactUsApi';
import { useFocusEffect } from '@react-navigation/native';
import BoxItem from '../../components/BoxItem';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../AuthContext';

const ContactUsStatus = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [contactUses, setContactUses] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [repliedData, setRepliedData] = useState([]);
  const [closedData, setClosedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const contactUsData = await getUserContactUs(user.user.userId);
          setContactUses(contactUsData);
          setPendingData(
            contactUsData
              .filter((item) => item.status === 'PENDING')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          );
          setRepliedData(
            contactUsData
              .filter((item) => item.status === 'REPLIED')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          );
          setClosedData(
            contactUsData
              .filter((item) => item.status === 'CLOSED')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.timeStamp))
          );
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }, [user.user.userId])
  );

  const handleTopicPress = (contactUs) => {

    navigation.navigate("Response", { contactUs });
    // console.log(contactUs)
    
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const contactUsData = await getUserContactUs(user.user.userId);
      setContactUses(contactUsData);
      setPendingData(
        contactUsData
          .filter((item) => item.status === 'PENDING')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setRepliedData(
        contactUsData
          .filter((item) => item.status === 'REPLIED')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setClosedData(
        contactUsData
          .filter((item) => item.status === 'CLOSED')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.timeStamp))
      );

    } catch (error) {
      console.error(error);
    }

    setRefreshing(false);
  };

  const renderEmptyListComponent = () => (
    <Text style={styles.messageText}>You have no enquiry here!</Text>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.formContainer} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={'#FFD700'}
        />
      }
      >
        <Text style={styles.header}>ContactUs Status</Text>
        <Text style={{ ...styles.statusHeader, color: 'red' }}>Pending</Text>
        {pendingData.length === 0 ? (
          renderEmptyListComponent()
        ) : (
          pendingData.map((item) => (
            <BoxItem key={item.contactUsId} {...item} parentTitleStatus="Pending" onPress={() => handleTopicPress(item)}/>
          ))
        )}


        <Text style={{ ...styles.statusHeader, color: 'green' }}>Replied</Text>
        {repliedData.length === 0 ? (
          renderEmptyListComponent()
        ) : (
          repliedData.map((item) => (
            <BoxItem key={item.contactUsId} {...item} parentTitleStatus="Replied" onPress={() => handleTopicPress(item)}/>
          ))
        )}

        <Text style={{ ...styles.statusHeader, color: 'grey' }}>Closed</Text>
        {closedData.length === 0 ? (
          renderEmptyListComponent()
        ) : (
          closedData.map((item) => (
            <BoxItem key={item.contactUsId} {...item} parentTitleStatus="Closed"/>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  formContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusSection: {
    marginBottom: 16,
  },
  flatListBorder: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statusHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 1,
    marginBottom: 8,
    marginTop: 6

  },
  messageText: {
    fontSize: 16,
  },
});

export default ContactUsStatus;
