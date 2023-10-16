import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createViewingAvailability } from '../../utils/scheduleApi';

const SetSchedule = ({ route }) => {
    const { propertyListingId } = route.params;
    const navigation = useNavigation();

    const [selectedTime, setSelectedTime] = useState(null);
    const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [startTimePickerDisplay, setStartTimePickerDisplay] = useState(null);
    const [endTimePickerDisplay, setEndTimePickerDisplay] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);


    // Function to handle time slot selection
    const handleTimeSlotSelect = (time) => {
        if (!startTime) {
            setStartTimePickerVisible(true);
        } else if (!endTime) {
            setEndTimePickerVisible(true);
        }
    };

// Handle time picker confirm for start time
const handleStartTimeConfirm = (time) => {
    const minutes = time.getMinutes();
    const roundedMinutes = Math.round(minutes / 30) * 30; // Round to the nearest 30 minutes
    time.setMinutes(roundedMinutes); // Update the minutes part of the time
    const selectedStartTime = new Date(time); // Convert to Date object
    const selectedEndTime = endTimePickerDisplay ? new Date(endTimePickerDisplay) : null;
    console.log("selectedEndTime", endTime)
    console.log("selectedStartTime", selectedStartTime)
    // Check if the selected start time is later than the current end time
    if (endTime && selectedStartTime >= endTime) {
        Alert.alert('Invalid Time', 'Start time cannot be later than or equal to end time.');
    } else {
        const formattedTime = selectedStartTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        setStartTime(selectedStartTime);
        setStartTimePickerDisplay(formattedTime);
        setStartTimePickerVisible(false);
    }
};

// Handle time picker confirm for end time
const handleEndTimeConfirm = (time) => {
    const minutes = time.getMinutes();
    const roundedMinutes = Math.round(minutes / 30) * 30; // Round to the nearest 30 minutes
    time.setMinutes(roundedMinutes); // Update the minutes part of the time
    const selectedEndTime = new Date(time); // Convert to Date object
    const selectedStartTime = startTimePickerDisplay ? new Date(startTimePickerDisplay) : null;
    console.log("selectedEndTime", selectedEndTime)
    console.log("selectedStartTime", startTime)
    // Check if the selected end time is earlier than the current start time
    if (startTime && selectedEndTime <= startTime) {
        Alert.alert('Invalid Time', 'End time cannot be earlier than or equal to start time.');
    } else {
        const formattedTime = selectedEndTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        setEndTime(selectedEndTime);
        setEndTimePickerDisplay(formattedTime);
        setEndTimePickerVisible(false);
    }
};

    // Generate time slots in 1-hour intervals
    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let i = 0; i < 24; i++) {
            const hour = i % 12 || 12; // Convert to 12-hour format
            const ampm = i < 12 ? 'AM' : 'PM';
            const time = `${hour}:00 ${ampm}`;
            timeSlots.push({
                id: i.toString(),
                time,
            });
        }
        return timeSlots;
    };

    // Define selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Function to handle day press in the calendar
    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSelectedTime(null); // Clear selected time when a new date is chosen
        setStartTime(null);
        setEndTime(null);
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    console.log("selectedTime", selectedTime)
    console.log("startTimePickerDisplay", startTime)
    console.log("endTimePickerDisplay", endTime)

    const handleSubmit = async () => {
        if (!selectedDate || !startTimePickerDisplay || !endTimePickerDisplay) {
            // Check if all fields are filled
            Alert.alert('Incomplete Information', 'Please select a date, start time, and end time.');
            return;
        }

        // Create the viewing availability object to be submitted
        const availabilityData = {
            propertyListingId: propertyListingId,
            date: selectedDate.toISOString().slice(0, 10), // Extract and format date component as DATEONLY
            startTimeSlot: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            endTimeSlot: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // Extract and format time component as TIME
        };

        // Call the API to create the viewing availability
        // Replace createViewingAvailability with your actual API call
        const response = await createViewingAvailability(availabilityData);

        // Placeholder response for testing
        // const response = { success: true };

        if (response.success) {
            // Show a success alert
            Alert.alert('Success', 'Availability added successfully.');

            // Clear selected time and time range
            setSelectedTime(null);
            setStartTime(null);
            setEndTime(null);

            // Refresh the screen to reflect the new date
            setSelectedDate(new Date());

            // You can also navigate back to a different screen if needed
            // navigation.navigate('SomeOtherScreen');
        } else {
            Alert.alert('Error', 'Failed to add availability. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Set Schedule Availability</Text>
                </View>
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={handleDayPress}
                        style={{
                            borderWidth: 0.5,
                            borderColor: 'gray',
                            height: 360,
                        }}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                        }}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: 'blue' },
                        }}
                    />
                </View>

                <View style={styles.timeSlotsContainer}>
                    <Text style={styles.dateOnContainer}>{formatDate(selectedDate)}</Text>
                    <View style={styles.timePickers}>
                        <TouchableOpacity
                            style={styles.timePicker}
                            onPress={() => setStartTimePickerVisible(true)}
                        >
                            <Text style={styles.timePickerText}>
                                Start Time: {startTimePickerDisplay || 'Select'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.timePicker}
                            onPress={() => setEndTimePickerVisible(true)}
                        >
                            <Text style={styles.timePickerText}>
                                End Time: {endTimePickerDisplay || 'Select'}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <DateTimePickerModal
                        isVisible={startTimePickerVisible}
                        mode="time"
                        minuteInterval={30}
                        onConfirm={handleStartTimeConfirm}
                        onCancel={() => setStartTimePickerVisible(false)}
                        is24Hour={false} // Use 12-hour format
                    />

                    <DateTimePickerModal
                        isVisible={endTimePickerVisible}
                        mode="time"
                        onConfirm={handleEndTimeConfirm}
                        onCancel={() => setEndTimePickerVisible(false)}
                        minuteInterval={30} // Set the minuteInterval to 60 for 1-hour intervals
                        is24Hour={false} // Use 12-hour format
                        display="spinner"
                    />
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.saveChangesButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    calendarContainer: {
        flex: 1,
        borderRadius: 8,
        padding: 0,
        marginBottom: 10,
    },
    timeSlotsContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        borderWidth: 0.2,
        borderColor: 'gray',
    },
    timePicker: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timePickerText: {
        fontSize: 14,
    },
    dateOnContainer: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 30,
        marginTop: 5,
    },
    saveChangesButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '60%',
        marginLeft: 70,
    },
    saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
    },
    timePickers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 10,
        marginRight: 20,
    },
});

export default SetSchedule;
