import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, View, Text } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import ForumItemHeader from './ForumItemHeader';
import ForumModal from './ForumModal';
import { getForumTopicVoteDetails, getAllForumTopicUnrestricted, updateForumTopicVote, updateForumTopicName } from '../../utils/forumTopicApi';
import EditForumTopicModal from './EditForumTopicModal';

const ForumItem = ({ userId, topicUserId, topicId, topicName, updatedAt, onPress, onReport, onDelete, useParentCallback, flagged }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [voteDetails, setVoteDetails] = useState([]);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [forumTopicsUnrestricted, setforumTopicsUnrestricted] = useState([]);

    const forumItemCallback = useCallback(() => {

        const fetchData = async () => {
            try {
                const voteData = await getForumTopicVoteDetails(userId, topicId);
                setVoteDetails(voteData);
                const forumTopicDataUnrestricted = await getAllForumTopicUnrestricted();
                // console.log(forumTopicDataUnrestricted);
                setforumTopicsUnrestricted(forumTopicDataUnrestricted);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData(); // Call a function to fetch data

    }, [])

    useFocusEffect(forumItemCallback)

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleEditModal = () => {
        setEditModalVisible(!isEditModalVisible);
    };

    const handleUpvote = async () => {
        try {
            const voteData = await updateForumTopicVote(userId, topicId, "upvote");
            forumItemCallback();
            // console.log(voteData)

        } catch (error) {
            console.error(error);
        }
    };
    const handleDownvote = async () => {
        try {
            const voteData = await updateForumTopicVote(userId, topicId, "downvote");
            forumItemCallback();
            // console.log(voteData)

        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = async (topicName) => {

        if (!topicName) {
            return;
        }

        try {
            const updatedTopic = { topicName }
            const forumTopic = await updateForumTopicName(userId, topicId, updatedTopic);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.topicItemContainer}>
                <ForumItemHeader
                    topicName={topicName}
                    updatedAt={updatedAt}
                    onMoreOptionsPress={toggleModal}
                    editable={userId === topicUserId}
                    onEdit={toggleEditModal}
                />
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
                    <View style={styles.postContainer}>
                        <Octicons name="comment-discussion" size={20} color="#FFD700" />
                        <Text style={styles.postText}>{voteDetails.totalPostCount}</Text>
                    </View>
                </View>
            </View>
            <EditForumTopicModal isVisible={isEditModalVisible} onCancel={toggleEditModal} onSubmit={handleEdit} oldTopicName={topicName} forumTopics={forumTopicsUnrestricted}/>
            {topicUserId === userId ?
                <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Topic"} onDelete={onDelete} flagged={flagged} />
                :
                <ForumModal isVisible={isModalVisible} onClose={toggleModal} onReport={onReport} itemType={"Topic"} flagged={flagged} />
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
    title: {
        fontSize: 14,
        marginHorizontal: 17,
        fontWeight: 'bold',
        // borderWidth:1,
    },
    message: {
        fontSize: 12,
        color: 'gray',
        marginHorizontal: 17,
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
    postContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postText: {
        marginLeft: 10,
        fontSize: 12,
        color: 'gray',
    },

})

export default ForumItem