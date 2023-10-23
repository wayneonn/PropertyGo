import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, RefreshControl } from 'react-native';
import ForumPostItem from '../../components/Forum/ForumPostItem';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getAllForumPost, updateForumPost, createForumPost, updateForumPostFlaggedStatus, deleteForumPost } from '../../utils/forumPostApi';
import AddForumPostModal from '../../components/Forum/AddForumPostModal';
import SearchBar from '../../components/Forum/SearchBar';

const ForumPostDefault = ({ navigation }) => {

  const { user } = useContext(AuthContext);
  const route = useRoute();
  const { topic } = route.params;
  const [forumPosts, setforumPosts] = useState([]);
  const [sort, setSort] = useState(false) //true will be ASC
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const useParentCallback = useCallback(() => {
    const fetchData = async () => {
      try {
        const forumPostData = await getAllForumPost(user.user.userId, topic.forumTopicId, null, sort);

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
    navigation.navigate("Forum Comment", {post});
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
          <Text style={styles.title}>{topic.topicName}</Text>
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <AntDesign name={sort ? "arrowup" : "arrowdown"} size={20} color="black" />
          </TouchableOpacity>
        </View>
        <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
        {filteredPosts.map((post, index) => (
          <ForumPostItem
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

export default ForumPostDefault;