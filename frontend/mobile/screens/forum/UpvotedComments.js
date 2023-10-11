import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../../AuthContext';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, RefreshControl, Image, TouchableHighlight, Button } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { updateForumCommentFlaggedStatus, deleteForumComment, getAllUserUpvotedForumComment} from '../../utils/forumCommentApi';
import { getAllForumPostById } from '../../utils/forumPostApi';
import ForumCommentItem from '../../components/Forum/ForumCommenItem';


const UpvotedComments = ({ navigation }) => {

    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const useParentCallback = useCallback(() => {
        const fetchData = async () => {
            try {
                const forumComment = await getAllUserUpvotedForumComment(user.user.userId, false);
                // console.log(forumComment);
                setComments(forumComment);

            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [])

    useFocusEffect(useParentCallback);

    const handleDeleteComment = async (forumCommentId) => {
        try {
            await deleteForumComment(user.user.userId, forumCommentId);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFlagComment = async (forumCommentId) => {
        try {
            await updateForumCommentFlaggedStatus(user.user.userId, forumCommentId);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }

    };

    const handlePostPress = async (comment) => {
        // console.log(comment.forumPostId);
        const post = await getAllForumPostById(comment.forumPostId);
        navigation.navigate("Forum Comment", { post });
    };


    const handleRefresh = async () => {
        setRefreshing(true);
        useParentCallback();
        setRefreshing(false);
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
                {comments.map((comment, index) => (
                    <ForumCommentItem
                        key={comment.forumCommentId}
                        userId={user.user.userId}
                        comment={comment}
                        onReport={() => handleFlagComment(comment.forumCommentId)}
                        onDelete={() => handleDeleteComment(comment.forumCommentId)}
                        useParentCallback={useParentCallback}
                        onPress={() => handlePostPress(comment)}
                    />
                ))}

            </ScrollView>

        </SafeAreaView >

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10,
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white', // Set background color
        // padding: 10, // Add padding to the container
        borderRadius: 10, // Add border radius for rounded corners
        marginHorizontal: 10,
        borderWidth: 1,
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 10, // Add margin to separate text input from icons
    },
    iconButton: {
        padding: 10,
    },
    selectedImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: 'gray',
    },
    selectedImage: {
        width: 150,
        height: 150,
    },
    removeImageButton: {
        backgroundColor: '#ccc',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        alignItems: 'center',
    },

})

export default UpvotedComments;