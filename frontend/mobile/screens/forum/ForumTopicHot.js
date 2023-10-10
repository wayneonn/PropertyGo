import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, RefreshControl } from 'react-native';
import ForumItem from '../../components/Forum/ForumItem';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getAllForumTopic, getAllForumTopicUnrestricted, updateForumTopicFlaggedStatus, createForumTopic } from '../../utils/forumTopicApi';
import AddForumTopicModal from '../../components/Forum/AddForumTopicModal';
import SearchBar from '../../components/Forum/SearchBar';

const ForumTopicHot = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [forumTopics, setforumTopics] = useState([]);
  const [forumTopicsUnrestricted, setforumTopicsUnrestricted] = useState([]);
  const [sort, setSort] = useState(false) //true will be ASC
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([])
  const [refreshing, setRefreshing] = useState(false);


  const useParentCallback = useCallback(() => {
    const fetchData = async () => {
      try {
        const forumTopicData = await getAllForumTopic(user.user.userId, "vote", sort);
        setforumTopics(forumTopicData)
        setFilteredTopics(forumTopicData);
        const forumTopicDataUnrestricted = await getAllForumTopicUnrestricted();
        // console.log(forumTopicDataUnrestricted);
        setforumTopicsUnrestricted(forumTopicDataUnrestricted);
        setSearchQuery('');
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [sort])

  useFocusEffect(useParentCallback);

  const handleTopicPress = (topic) => {
    setSearchQuery('');
    navigation.navigate("Forum Post Tab Navigator", { topic });
  };

  const handleFilterPress = () => {
    setSort(!sort)
  };

  const handleFlag = async (forumTopicId) => {
    await updateForumTopicFlaggedStatus(user.user.userId, forumTopicId);
    // console.log("Topic flagged!");
    useParentCallback();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleNewForumTopic = async (topicName) => {

    if (!topicName) {
      Alert.alert('Error', 'Topic Name is empty.');
      return;
    }

    try {
      const newTopic = { topicName }
      const forumTopic = await createForumTopic(user.user.userId, newTopic);
      useParentCallback();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (text) => {
    // Filter the topics based on the search query
    const filtered = forumTopics.filter((topic) =>
      topic.topicName.toLowerCase().includes(text.toLowerCase())
    );
    // console.log("text :" + text)

    if (text === "") {
      setFilteredTopics(forumTopics);
    } else {
      setFilteredTopics(filtered);
    }

    setSearchQuery(text);
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    useParentCallback();
    setRefreshing(false);
  };

  const handleDelete = async (forumTopicId) => {
    try {
      await deleteForumTopic(user.user.userId, forumTopicId)
      useParentCallback();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={'#FFD700'}
        />
      }>
        <View style={styles.header}>
          <Text style={styles.title}>Forum Topics</Text>
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <AntDesign name={sort ? "arrowup" : "arrowdown"} size={20} color="black" />
          </TouchableOpacity>
        </View>
        <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
        {filteredTopics.map((topic, index) => (
          <ForumItem
            key={topic.forumTopicId}
            userId={user.user.userId}
            topicUserId={topic.userId}
            topicId={topic.forumTopicId}
            topicName={topic.topicName}
            updatedAt={topic.updatedAt}
            onPress={() => handleTopicPress(topic)}
            onReport={() => handleFlag(topic.forumTopicId)}
            onDelete={() => handleDelete(topic.forumTopicId)}
            useParentCallback={useParentCallback}
          />
        ))}
      </ScrollView>
      <TouchableOpacity onPress={toggleModal} style={styles.addItem}>
        <Ionicons name="add-circle" size={50} color="#FFD700" />
      </TouchableOpacity>
      <AddForumTopicModal isVisible={isModalVisible} onCancel={toggleModal} onSubmit={handleNewForumTopic} forumTopics={forumTopicsUnrestricted} />
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: 'transparent'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    // borderWidth:1,
    paddingEnd: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    marginHorizontal: 17,
    fontWeight: 'bold', // Add fontWeight to make the title bold
  },
  filterButton: {
    paddingHorizontal: 10,
  },
  addItem: {
    alignItems: 'center',
    // paddingEnd: 30,
    marginLeft: 300,
    marginRight: 10,
    // flex:1,
    // borderWidth:1,
    // backgroundColor: "black"
  }
});

export default ForumTopicHot;

