import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getTimeAgo } from '../../services/CalculateTimeAgo';
import ForumPostItemHeader from './ForumPostItemHeader';
import ImageGallery from './ImageGallery';
import ForumModal from './ForumModal';
import { getForumCommentVoteDetails, updateForumCommentVote, updateForumComment } from '../../utils/forumCommentApi';
import EditForumCommentModal from './EditForumCommentModal';

const ForumCommentItem = ({ userId, comment, onReport, onDelete, useParentCallback }) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false)
    const [voteDetails, setVoteDetails] = useState([]);

    const forumCommentItemCallback = useCallback(() => {

        const fetchData = async () => {
            try {
                const voteData = await getForumCommentVoteDetails(userId, comment.forumCommentId);
                setVoteDetails(voteData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData(); // Call a function to fetch data

    }, [])

    useFocusEffect(forumCommentItemCallback)

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleEditModal = () => {
        setEditModalVisible(!isEditModalVisible);
    };

    const handleUpvote = async () => {
        try {
            const voteData = await updateForumCommentVote(userId, comment.forumCommentId, "upvote");
            forumCommentItemCallback();
            // console.log(voteData)

        } catch (error) {
            console.error(error);
        }
    };

    const handleDownvote = async () => {
        try {
            const voteData = await updateForumCommentVote(userId, comment.forumCommentId, "downvote");
            forumCommentItemCallback();
            console.log(voteData)
            // console.log(voteData)

        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = async (commentDetails) => {

        console.log(commentDetails)
        if (!commentDetails) {
            return;
        }

        try {

            await updateForumComment(userId, commentDetails);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }

    };



    return (
        <View style={styles.topicItemContainer}>
            <ForumPostItemHeader
                userId={comment.userId}
                onMoreOptionsPress={toggleModal}
                editable={comment.userId === userId}
                onEdit={toggleEditModal}
            />
            <View >
                <Text style={styles.age}>{getTimeAgo(comment.updatedAt)}</Text>
                <Text style={styles.message}>{comment.message}</Text>
                <ImageGallery images={comment.images} />
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
            </View>

            <EditForumCommentModal isVisible={isEditModalVisible} onCancel={toggleEditModal} onSubmit={handleEdit} comment={comment}/>
            
            {comment.userId === userId ?
                <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Comment"} onDelete={onDelete} />
                :
                <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Comment"} />
            }

        </View>

    );
};

const styles = StyleSheet.create({
    topicItemContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    age: {
        fontSize: 10,
        color: 'gray',
        marginHorizontal: 15,
        marginTop: 5,
        // borderWidth: 1,
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
})
export default ForumCommentItem;