import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { getTimeAgo } from '../../services/CalculateTimeAgo';

const ChatItem = ({ onPress, updatedAt, name, title, messageText, replied, profileImage, propertyImage }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.ChatItemContainer}>
                <View style={styles.headerContainer}>
                    <View style={styles.leftHeaderContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Icon name="user" size={20} color="white" />
                            </View>
                        )}
                        <Text style={styles.userName}>{name}{replied ? <Entypo name="dot-single" size={20} color="red" /> : null}</Text>
                    </View>
                    <Text style={styles.updatedAt}>{getTimeAgo(updatedAt)}</Text>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.messageContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        {messageText ?
                            <Text style={[styles.message, replied ? { fontWeight: 'bold' } : null]}>
                                {messageText.trim()}
                            </Text>
                            : null
                        }
                    </View>
                    <View style={styles.propertyImageContainer}>
                        {propertyImage ? (
                            <Image source={{ uri: propertyImage }} style={styles.propertyImage} />
                        ) : (
                            <View style={styles.propertyImagePlaceholder}>
                                <Ionicons name="home" size={24} color="white" />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    ChatItemContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        paddingVertical: 10,
    },
    leftHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    readMessage: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginHorizontal: 12,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth: 1,
        paddingHorizontal: 14
    },
    messageContainer: {
        flex: 1, // Allow the message container to take up available space
    },
    propertyImageContainer: {
        marginLeft: 10, // Add margin to separate the message and property image
        width: 45, // Adjust the width of the property image container
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
    },
    profileImagePlaceholder: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertyImage: {
        width: '100%', // Make the property image take up the full width of its container
        height: 45,
        borderRadius: 5,
    },
    propertyImagePlaceholder: {
        width: '100%', // Make the placeholder take up the full width of its container
        height: 45,
        borderRadius: 5,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        marginLeft: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    title: {
        fontSize: 16,
        // marginLeft: 15,
        marginRight: 5,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 14,
        // borderWidth:1,
        // marginLeft: 15,
        // align:"center",
        // justifyContent:"center"
    },
    updatedAt: {
        fontSize: 12,
        color: 'gray',
    },
});

export default ChatItem;