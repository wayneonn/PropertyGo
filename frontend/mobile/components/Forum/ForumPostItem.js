import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, View, Text, Image, KeyboardAvoidingView } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import ForumPostItemHeader from './ForumPostItemHeader';
import ForumModal from './ForumModal';
import { getForumPostVoteDetails, updateForumPostVote, updateForumPost } from '../../utils/forumPostApi';
import { getTimeAgo } from '../../services/CalculateTimeAgo';
import ImageGallery from './ImageGallery';
import EditForumPostModal from './EditForumPostModal';

const ForumPostItem = ({ userId, post, onPress, onReport, onDelete, useParentCallback, flagged }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [voteDetails, setVoteDetails] = useState([]);
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    const forumPostItemCallback = useCallback(() => {

        const fetchData = async () => {
            try {
                const voteData = await getForumPostVoteDetails(userId, post.forumPostId);
                setVoteDetails(voteData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData(); // Call a function to fetch data

    }, [])

    useFocusEffect(forumPostItemCallback)

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleEditModal = () => {
        setEditModalVisible(!isEditModalVisible);
    };

    const handleUpvote = async () => {
        try {
            const voteData = await updateForumPostVote(userId, post.forumPostId, "upvote");
            forumPostItemCallback();
            // console.log(voteData)

        } catch (error) {
            console.error(error);
        }
    };
    const handleDownvote = async () => {
        try {
            const voteData = await updateForumPostVote(userId, post.forumPostId, "downvote");
            forumPostItemCallback();
            console.log(voteData)
            // console.log(voteData)

        } catch (error) {
            console.error(error);
        }
    };
    const handleEdit = async (postDetails) => {

        console.log(postDetails)
        if (!postDetails) {
            return;
        }

        try {

            const forumTopic = await updateForumPost(userId, postDetails);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <TouchableOpacity onPress={onPress}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.topicItemContainer}>
                    <ForumPostItemHeader
                        userId={post.userId}
                        onMoreOptionsPress={toggleModal}
                        editable={post.userId === userId}
                        onEdit={toggleEditModal}
                    />

                    <View >
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{post.title}</Text>
                            <Text style={styles.age}>{getTimeAgo(post.updatedAt)}</Text>
                        </View>
                        <View>
                            <Text style={styles.message}>{post.message}</Text>
                        </View>
                        <ImageGallery images={post.images} />
                    </View>

                    <View style={styles.iconContainer}>
                        <View style={styles.voteContainer}>
                            <TouchableOpacity onPress={handleUpvote}>
                                <FontAwesome name="thumbs-up" size={20} color={voteDetails.userUpvote ? "green" : "grey"} />
                            </TouchableOpacity>
                            <Text style={styles.totalVoteText}>{voteDetails.totalUpvote - voteDetails.totalDownvote}</Text>
                            <TouchableOpacity onPress={handleDownvote}>
                                <FontAwesome name="thumbs-down" size={20} color={voteDetails.userDownvote ? "red" : "grey"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.commentContainer}>
                            <Octicons name="comment-discussion" size={20} color="#FFD700" />
                            <Text style={styles.commentText}>{voteDetails.totalCommentCount}</Text>
                        </View>
                    </View>
                </View>
                <EditForumPostModal isVisible={isEditModalVisible} onCancel={toggleEditModal} onSubmit={handleEdit} post={post} />
                {post.userId === userId ?
                    <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Post"} onDelete={onDelete} />
                    :
                    <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Post"} flagged={flagged} />
                }
            </KeyboardAvoidingView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    topicItemContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    title: {
        fontSize: 14,
        marginLeft: 15,
        marginRight: 5,
        fontWeight: 'bold',
        // borderWidth:1,
        maxWidth:"70%",
    },
    age: {
        fontSize: 10,
        color: 'gray',
        alignSelf:"flex-start",
        marginTop: 2,
    },
    message: {
        fontSize: 14,
        marginHorizontal: 15,
    },
    iconContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    voteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 80,
        marginRight: 30,
    },
    totalVoteText: {
        fontSize: 12,
        color: 'gray',
        marginLeft: 5,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentText: {
        marginLeft: 10,
        fontSize: 12,
        color: 'gray',
    },

})

export default ForumPostItem