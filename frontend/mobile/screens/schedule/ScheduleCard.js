import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const ScheduleCard = ({ schedule, onPress }) => {
    const [currentColor, setCurrentColor] = useState('blue'); // Initial color
    const colors = ['red', 'green', 'blue', 'orange']; // Define your desired colors
    const animationDuration = 1000; // Duration for each color change (in milliseconds)

    useEffect(() => {
        // Create a timer to change the color at regular intervals
        const colorChangeTimer = setInterval(() => {
            // Get the next color in the array
            const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
            const nextColor = colors[nextColorIndex];
            setCurrentColor(nextColor);
        }, animationDuration);

        // Clear the timer when the component unmounts
        return () => clearInterval(colorChangeTimer);
    }, [currentColor]);

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(schedule.scheduleId)}>
            <View style={styles.scheduleDetails}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="calendar-outline" size={24} color="black" style={{ marginRight: 4 }} />
                    <Text style={styles.scheduleDate}>{schedule.meetupDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="time-outline" size={24} color="black" style={{ marginRight: 4 }} />
                    <Text style={styles.scheduleTime}>{schedule.meetupTime}</Text>
                </View>
                {/* Add more schedule details if needed */}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        alignSelf: 'center', // Center the card
        marginVertical: 10, // A little margin top and bottom for spacing between cards
        borderRadius: 10,
        borderWidth: 0.5, // Light border
        borderColor: '#ddd', // Light gray color
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 7,
        width: Dimensions.get('window').width * 0.8,
    },
    scheduleDetails: {
        padding: 10,
        justifyContent: 'space-between',
    },
    scheduleDate: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
    },
    scheduleTime: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
    },
});

export default ScheduleCard;
