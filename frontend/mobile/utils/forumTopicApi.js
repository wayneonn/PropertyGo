import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Function to create a new ForumTopic record
export const createForumTopic = async (userId, forumTopicData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/${userId}/forumTopic`,
            forumTopicData
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumTopic records for a specific user
export const getAllForumTopic = async (userId, sort, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumTopic?sort=${sort}&increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getForumTopicVoteDetails = async (userId, forumTopicId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumTopic/${forumTopicId}/voteDetails`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumTopicFlaggedStatus = async (userId, forumTopicId) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumTopic/${forumTopicId}/flagTopic`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumTopicVote = async (userId, forumTopicId, voteType) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumTopic/${forumTopicId}/voteTopic?voteType=${voteType}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateForumTopicName = async (userId, forumTopicId, updatedTopicName) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/${userId}/forumTopic/${forumTopicId}/updateTopicName`, updatedTopicName);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteForumTopic = async (userId, forumTopicId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/user/${userId}/forumTopic/${forumTopicId}/deleteForumTopic`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};