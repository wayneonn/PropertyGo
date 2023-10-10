import axios from 'axios';
import configData from "../config.json"

const BASE_URL = configData.BASE_URL;

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
export const getAllForumTopicUnrestricted = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/forumTopic/Unrestricted`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllForumTopic = async (userId, sort, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumTopic?sort=${sort}&increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumTopic records for a specific user
export const getAllUserUpvotedForumTopic = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumTopicsUserUpvoted?increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumTopic records for a specific user
export const getAllUserDownvotedForumTopic = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumTopicsUserDownvoted?increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumTopic records for a specific user
export const getAllUserFlaggedForumTopic = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumTopicsUserFlagged?increase=${order}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get ForumTopic records for a specific user
export const getAllForumTopicByUserId = async (userId, order) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}/forumTopicsByUserId?increase=${order}`);
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