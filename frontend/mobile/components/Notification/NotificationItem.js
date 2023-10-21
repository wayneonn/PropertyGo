import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const NotificationItem = () => {
    return (
        <TouchableOpacity>
            <View style={styles.topicItemContainer}>
                <View style={styles.notificationContent}>

                    <View style={styles.userProfile}>
                        {/* <Text>Notification Content Goes Here</Text> */}
                    </View>

                    <View style={styles.middleContent}>
                        <Text>Notification Content Goes Here</Text>
                    </View>

                    <View style={styles.timestamp}>
                        <Text>10:30 AM</Text>
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
        // Add styles for the user profile picture
    },
    middleContent: {
        flex: 1, // Expand to fill available space
        marginLeft: 10, // Add margin for spacing
    },
    timestamp: {
        // Add styles for the timestamp
    },
});
