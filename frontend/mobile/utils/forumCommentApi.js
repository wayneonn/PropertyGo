import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

export const createForumComment = async (userId, forumCommentData) => {
    try {

        // console.log(userId)
        // console.log(forumCommentData)

        // Make a POST request with the forumCommentData
        const response = await axios.post(
            `${BASE_URL}/user/${userId}/forumComment`,
            forumCommentData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumComment records for a specific user
export const getAllForumComment = async (userId, forumPostId, sort, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumComment?forumPostId=${forumPostId}&sort=${sort}&increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getForumCommentVoteDetails = async (userId, forumCommentId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumComment/${forumCommentId}/voteDetails`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumCommentFlaggedStatus = async (userId, forumCommentId) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumComment/${forumCommentId}/flagComment`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumCommentVote = async (userId, forumCommentId, voteType) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumComment/${forumCommentId}/voteComment?voteType=${voteType}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumComment = async (userId, updatedComment) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumComment/updateComment`, updatedComment);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteForumComment = async (userId, forumCommentId) => {
    try {
        console.log("Deleting forum Comment!")
        const response = await axios.delete(`${BASE_URL}/user/${userId}/forumComment/${forumCommentId}/deleteForumComment`);
        // console.log("response:", response)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};