import React, { useState, } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { getTimeAgo } from '../../services/CalculateTimeAgo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import base64 from 'react-native-base64';

const NotificationItem = ({ onPress, profileImage, content, updatedAt, completed, pending }) => {

    const [convertedProfileImage, setConvertedProfileImage] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {

                    // console.log("profileImage :", profileImage)
                    let profileImageBase64;
                    if (profileImage && profileImage?.data) {
                        profileImageBase64 = base64.encodeFromByteArray(profileImage.data);
                        setConvertedProfileImage(`data:image/jpeg;base64,${profileImageBase64}`);
                        // console.log(profileImageBase64)
                    }

                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }, []));

    // console.log(content)
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{
                    ...styles.topicItemContainer,
                    borderColor: completed ? "green" : pending ? "red" : "black"
                }}
            >
                <View style={styles.notificationContent}>

                    {convertedProfileImage ? (
                        <Image source={{ uri: convertedProfileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.userProfile}>
                            <Icon name="user" size={30} color="white" />
                        </View>
                    )}

                    <View style={styles.middleContent}>
                        <Text>{content}</Text>
                    </View>

                    <View style={styles.rightContent}>
                        {completed ? <Text style={styles.completed}>Completed!</Text> : null}
                        {pending ? <Text style={styles.pending}>Pending Action!</Text> : null}
                        <Text style={styles.timestamp}>{getTimeAgo(updatedAt)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default NotificationItem;

const styles = StyleSheet.create({
    topicItemContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
        padding: 10, // Add padding for spacing
    },
    userProfile: {
        width: 50, // Adjust the width for the user profile picture
        height: 50, // Adjust the height for the user profile picture
        borderRadius: 25, // Make it round (adjust as needed)
        backgroundColor: 'lightgray', // Background color for the user profile picture
        alignItems: "center",
        justifyContent: 'center',
        // Add styles for the user profile picture
    },
    middleContent: {
        flex: 1, // Expand to fill available space
        marginHorizontal: 10, // Add margin for spacing'
        fontSize: 14,
    },
    rightContent: {
        alignItems: 'center',
    },
    pending: {
        // Add styles for the timestamp
        fontSize: 12,
        color: "red",
    },
    completed: {
        // Add styles for the timestamp
        fontSize: 12,
        color: "green",
    },
    timestamp: {
        // Add styles for the timestamp
        fontSize: 12
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});
