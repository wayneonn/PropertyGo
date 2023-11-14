import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, RefreshControl } from 'react-native';
import PropertyForumPostItem from '../../components/Forum/PropertyForumPostItem';
import { getAllForumPost, updateForumPost, createForumPost, updateForumPostFlaggedStatus, deleteForumPost } from '../../utils/forumPostApi';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getTopicByForumTopicId } from '../../utils/forumTopicApi';
import AddForumPostModal from '../../components/Forum/AddForumPostModal';
import SearchBar from '../../components/Forum/SearchBar';

const ForumPostDefault = ({ navigation, route }) => {

  const { user } = useContext(AuthContext);
  // const route = useRoute();
  const { topicId } = route.params;
  const [topic, setTopic] = useState([]);
  const [forumPosts, setforumPosts] = useState([]);
  const [sort, setSort] = useState(false) //true will be ASC
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("topicId: ", topicId)
    fetchForumTopic();
  }, [])

  useEffect(() => {
    if (topic && topic.forumTopicId) {
      useParentCallback();
    }
  }, [topic, useParentCallback]);

  const fetchForumTopic = async () => {
    try {
      const { success, data, message } = await getTopicByForumTopicId(topicId);
      console.log("data: ", data.forumTopics[0])
      setTopic(data.forumTopics[0]);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    }
  };

  const useParentCallback = useCallback(() => {
    const fetchData = async () => {
      try {
        console.log("topic.forumTopicId: ", topicId)
        const forumPostData = await getAllForumPost(user.user.userId, topicId, null, sort);

        setforumPosts(forumPostData)
        setFilteredPosts(forumPostData);
        setSearchQuery('');
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();

    return () => {

      setforumPosts([])
      setFilteredPosts([]);
    };
  }, [sort])

  useFocusEffect(useParentCallback);



  const handlePostPress = (post) => {
    setSearchQuery('');
    navigation.navigate("Forum Comment", { post });
  };

  const handleFilterPress = () => {
    setSort(!sort)
  };

  const handleFlag = async (forumPostId) => {
    await updateForumPostFlaggedStatus(user.user.userId, forumPostId);
    useParentCallback();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleNewForumPost = async (postDetails) => {

    // if (!postDetails.title | !postDetails.message) {
    //   // Alert.alert('Error', 'All fields must not be empty.');
    //   return;
    // }

    try {
      const forumPost = await createForumPost(user.user.userId, postDetails);
      // console.log(postDetails)
      useParentCallback();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (text) => {

    const filtered = forumPosts.filter((post) =>
      post.title.toLowerCase().includes(text.toLowerCase())
    );
    // console.log("text :" + text)

    if (text === "") {
      setFilteredPosts(forumPosts);

    } else {

      setFilteredPosts(filtered);

    }

    setSearchQuery(text);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    useParentCallback();
    setRefreshing(false);
  };

  const handleDelete = async (forumPostId) => {
    try {
      await deleteForumPost(user.user.userId, forumPostId)
      useParentCallback();
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      {!topic && !forumPosts ? (
        <>
          <Text style={styles.title}>No forum posts available</Text>
        </>
      ) : (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={'#FFD700'}
              />
            }
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>{topic.topicName}</Text>
              <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
                <AntDesign name={sort ? "arrowup" : "arrowdown"} size={20} color="black" />
              </TouchableOpacity>
            </View>
            <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
            {filteredPosts.map((post, index) => (
              <PropertyForumPostItem
                key={post.forumPostId}
                userId={user.user.userId}
                post={post}
                onPress={() => handlePostPress(post)}
                onReport={() => handleFlag(post.forumPostId)}
                onDelete={() => handleDelete(post.forumPostId)}
                useParentCallback={useParentCallback}
              />
            ))}
          </ScrollView>
          <AddForumPostModal isVisible={isModalVisible} onCancel={toggleModal} onSubmit={handleNewForumPost} forumTopicId={topic.forumTopicId} />
          <TouchableOpacity onPress={toggleModal} style={styles.addItem}>
            <Ionicons name="add-circle" size={50} color="#FFD700" />
          </TouchableOpacity>
        </>
      )}


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
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    // borderWidth:1,
    paddingEnd: 10,
    marginVertical: 10,
    marginBottom: 60,
  },
  title: {
    fontSize: 18,
    marginBottom: -30,
    marginHorizontal: 50,
    fontWeight: 'bold', // Add fontWeight to make the title bold
    textAlign: 'center',
    paddingHorizontal: 40,
    alignContent: 'center',
    // marginRight: -20,

  },
  filterButton: {
    paddingHorizontal: 10,
    position: 'absolute',
    right: 16, // Adjust the top position as needed
  },
  addItem: {
    alignItems: 'center',
    // paddingEnd: 30,
    marginLeft: 300,
    marginRight: 10,
    // flex:1,
    // borderWidth:1,
    // backgroundColor: "black"
  },
  backButton: {
    position: 'absolute',
    top: 16, // Adjust the top position as needed
    left: 16, // Adjust the left position as needed
    zIndex: 1, // Place it above the swiper
  },
});

export default ForumPostDefault;