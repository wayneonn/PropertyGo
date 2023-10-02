import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, View, Text } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import ForumPostItemHeader from './ForumPostItemHeader';
import ForumModal from './ForumModal';
import { getForumPostVoteDetails, updateForumPostVote } from '../../utils/forumPostApi';
import { getTimeAgo } from '../../services/CalculateTimeAgo';

const ForumPostItem = ({ userId, post, onPress, onReport, onDelete }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [voteDetails, setVoteDetails] = useState([]);

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

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.topicItemContainer}>
                <ForumPostItemHeader
                    user={post.userId}
                    onMoreOptionsPress={toggleModal}
                />

                <View >
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{post.title}</Text>
                        <Text style={styles.age}>{getTimeAgo(post.updatedAt)}</Text>
                    </View>
                    <View>
                        <Text style={styles.message}>{post.message}</Text>
                    </View>
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
            {post.userId === userId ?
                <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Post"} onDelete={onDelete} />
                :
                <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Post"} />
            }
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
    },
    age: {
        fontSize: 10,
        color: 'gray',

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