import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

// Function to create a new ForumPost record
export const createForumPost = async (userId, forumPostData) => {
    try {

        // console.log(userId)
        // console.log(forumPostData)

        // Make a POST request with the forumPostData
        const response = await axios.post(
            `${BASE_URL}/user/${userId}/forumPost`,
            forumPostData,
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

// Function to get ForumPost records for a specific user
export const getAllForumPost = async (userId, forumTopicId, sort, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumPost?forumTopicId=${forumTopicId}&sort=${sort}&increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllForumPostById = async (forumPostId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/forumPost/${forumPostId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumPost records for a specific user
export const getAllUserUpvotedForumPost = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumPostsUserUpvoted?increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumPost records for a specific user
export const getAllUserDownvotedForumPost = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumPostsUserDownvoted?increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumPost records for a specific user
export const getAllUserFlaggedForumPost = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumPostsUserFlagged?increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumPost records for a specific user
export const getAllForumPostByUserId = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumPostsByUserId?increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getForumPostVoteDetails = async (userId, forumPostId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumPost/${forumPostId}/voteDetails`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumPostFlaggedStatus = async (userId, forumPostId) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumPost/${forumPostId}/flagPost`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumPostVote = async (userId, forumPostId, voteType) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumPost/${forumPostId}/votePost?voteType=${voteType}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumPost = async (userId, updatedPost) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumPost/updatePost`, updatedPost);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteForumPost = async (userId, forumPostId) => {
    try {
        console.log("Deleting forum post!")
        const response = await axios.delete(`${BASE_URL}/user/${userId}/forumPost/${forumPostId}/deleteForumPost`);
        // console.log("response:", response)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};