import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Function to create a new ForumPost record
export const createForumPost = async (userId, forumPostData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/${userId}/forumPost`,
            forumPostData
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
        const response = await axios.delete(`${BASE_URL}/user/${userId}/forumPost/${forumPostId}/deleteForumPost`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};