import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { getTimeAgo } from '../services/CalculateTimeAgo';
import HTML from 'react-native-render-html';

const BoxItem = ({ onPress, parentTitleStatus, title, reason, message, updatedAt, responses }) => {
    
    const windowWidth = useWindowDimensions().width;
    const backgroundColor =
        parentTitleStatus === 'Replied'
            ? 'rgba(0, 255, 0, 0.1)'
            : parentTitleStatus === 'Pending' ? 'rgba(255, 0, 0, 0.1)' : '#ccc';

    let latestResponse = null;

    // console.log(responses)

    // Iterate through the responses to find the latest one
    responses.forEach((response) => {
        if (!latestResponse || response?.updatedAt > latestResponse?.updatedAt) {
            latestResponse = response;
        }
    });

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ ...styles.box, backgroundColor }}>
                <View style={styles.leftBox}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.reasonText}>{reason}</Text>
                    <Text style={styles.messageText}><Text style={{ fontWeight: 'bold' }}>Description:</Text> {message}</Text>
                    {latestResponse && (
                        <Text style={styles.messageText}><Text style={{ fontWeight: 'bold' }}>Reply: </Text><HTML source={{ html: latestResponse.message.replace(/<\/?p>/g, '').replace(/<html>|<\/html>/g, '')}} contentWidth={windowWidth}/></Text>
                    )}
                </View>
                <View style={styles.rightBox}>
                    <Text style={styles.timestampText}>{getTimeAgo(updatedAt)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    leftBox: {
        flex: 3,
    },
    rightBox: {
        flex: 1,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reasonText: {
        fontSize: 14,
        color: '#888888',
    },
    messageText: {
        fontSize: 14,
        marginTop: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timestampText: {
        fontSize: 12,
        color: '#888888',
    },
});

export default BoxItem;
