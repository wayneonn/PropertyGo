import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
    createSchedule,
    getViewingAvailabilityByDateAndPropertyId,
    getViewingAvailabilityByPropertyId,
    removeViewingAvailability,
    updateViewingAvailability,
} from '../../utils/scheduleApi';

const SetSchedule = ({ route }) => {
    const { propertyListingId } = route.params;
    const navigation = useNavigation();

    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [startTimePickerDisplay, setStartTimePickerDisplay] = useState(null);
    const [endTimePickerDisplay, setEndTimePickerDisplay] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    // Define selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availability, setAvailability] = useState([]);
    const [isToBeUpdated, setIsToBeUpdated] = useState(false);
    const [viewingAvailabilityId, setViewingAvailabilityId] = useState(null);
    const numColumns = 3;

    useEffect(() => {
        fetchViewingAvailabilityByDateAndPropertyId();
        fetchViewingAvailabilityByPropertyId();
    }, [selectedDate, isToBeUpdated]);

    const fetchViewingAvailabilityByDateAndPropertyId = async () => {
        const { success, data, message } = await getViewingAvailabilityByDateAndPropertyId(
            selectedDate,
            propertyListingId
        );

        if (success) {
            // setIsToBeUpdated(true);
            setStartTime(convertToDateTime(data[0].startTimeSlot));
            setEndTime(convertToDateTime(data[0].endTimeSlot));
            setViewingAvailabilityId(data[0].viewingAvailabilityId);
        } else {
            console.error('Error:', message);
            setIsToBeUpdated(false);
        }
    };

    const convertToDateTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':');
        const formattedDate = new Date();
        formattedDate.setHours(parseInt(hours, 10));
        formattedDate.setMinutes(parseInt(minutes, 10));
        formattedDate.setSeconds(parseInt(seconds, 10));
        return formattedDate;
    };

    const fetchViewingAvailabilityByPropertyId = async () => {
        const { success, data, message } = await getViewingAvailabilityByPropertyId(
            propertyListingId
        );

        if (success) {
            console.log('data: ', data);
            setAvailability(data);
        } else {
            console.error('Error fetchViewingAvailabilityByPropertyId:', message);
            setAvailability([]);
        }
    };

    // Function to handle time slot selection
    const handleTimeSlotSelect = (time) => {
        // Combine the selected date with the parsed time to create a DateTime object
        const selectedDateTime = new Date(selectedDate);
        const [timeWithoutAmPm, period] = time.split(' '); // Split time and AM/PM
        const [hours, minutes] = timeWithoutAmPm.split(':').map(Number);

        // Calculate adjusted hours for PM
        let adjustedHours = hours;
        if (period === 'PM' && hours !== 12) {
            adjustedHours += 12;
        } else if (period === 'AM' && hours === 12) {
            adjustedHours = 0; // Midnight (12:00 AM) is represented as 0 in 24-hour format
        }

        selectedDateTime.setHours(adjustedHours);
        selectedDateTime.setMinutes(minutes);

        setSelectedTime(time);
        setSelectedSchedule(selectedDateTime);
        // console.log('setSelectedTime:', selectedDateTime);
    };


    function convertTimeTo12HourFormat(time) {
        const [hours, minutes, seconds] = time.split(':');
        let period = 'AM';
        let formattedHours = parseInt(hours);

        if (formattedHours >= 12) {
            period = 'PM';
            if (formattedHours > 12) {
                formattedHours -= 12;
            }
        }

        return `${formattedHours}:${minutes} ${period}`;
    }

    // Generate hourly time slots between start and end times
    const generateTimeSlots = () => {
        const timeSlots = [];
        if (startTime && endTime) {
            const startHour = startTime.getHours();
            const endHour = endTime.getHours();
            for (let i = startHour; i <= endHour; i++) {
                const hour = i % 12 || 12; // Convert to 12-hour format
                const ampm = i < 12 ? 'AM' : 'PM';
                const time = `${hour}:00 ${ampm}`;
                timeSlots.push({
                    id: i.toString(),
                    time,
                });
            }
        }
        return timeSlots;
    };

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

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime) {
            // Check if all fields are filled
            Alert.alert('Incomplete Information', 'Please select a date, start time, and end time.');
            return;
        }

        // Create the viewing availability object to be submitted
        const scheduleData = {
            meetup: selectedSchedule
        };

        // Call the API to create or update the viewing availability
        let response;

        if (isToBeUpdated === false) {
            response = await createSchedule(scheduleData);
            if (response.success) {
                Alert.alert('Success', 'Schedule booked successfully.');
            } else {
                Alert.alert('Error', 'Failed to book. Please try again later.');
            }
        } else {
            Alert.alert('Success', 'Schedule updated successfully.');
            response = await updateViewingAvailability(scheduleData, viewingAvailabilityId);
            if (response.success) {
                Alert.alert('Success', 'Schedule updated successfully.');
            } else {
                Alert.alert('Error', 'Failed to book. Please try again later.');
            }
        }
    };

    const handleRemove = async () => {
        if (viewingAvailabilityId) {
            const response = await removeViewingAvailability(viewingAvailabilityId);
            if (response.success) {
                // Show a success alert
                Alert.alert('Success', 'Availability successfully removed.');

                // Clear selected time and time range
                setSelectedTime(null);
                setStartTime(null);
                setEndTime(null);

                // Refresh the screen to reflect the new date
                setSelectedDate(new Date());
            } else {
                Alert.alert('Error', 'Failed to remove availability. Please try again later.');
                console.log('Error:', response.message);
            }
        } else {
            Alert.alert('No Availability to Remove', 'There is no availability to remove for the selected date.');
        }
    };

    const getMarkedDates = () => {
        const markedDates = {};

        if (availability.length === 0) {
            markedDates[selectedDate] = { selected: true, selectedColor: 'blue' };
        }

        // Loop through the data and mark the dates
        availability.forEach((availability) => {
            const date = availability.date; // Get the date from the fetched data

            // Specify how you want to mark the date

            markedDates[date] = { selected: true, selectedColor: 'green' };
            markedDates[selectedDate] = { selected: true, selectedColor: 'blue' };
        });

        return markedDates;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled" // Add this prop
            >
                <View style={styles.headerContainer}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Book Property Viewing</Text>
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
                        markedDates={getMarkedDates()}
                    />
                </View>

                {/* Time Slots Matrix (Bottom Half) */}

                <View style={styles.timeSlotsContainer}>
                    <Text style={styles.dateOnContainer}>{formatDate(selectedDate)}</Text>
                    {generateTimeSlots().length > 0 ? (
                        <FlatList
                            data={generateTimeSlots()}
                            keyExtractor={(item) => item.id}
                            numColumns={numColumns}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleTimeSlotSelect(item.time)}
                                    style={[
                                        styles.timeSlot,
                                        selectedTime === item.time ? styles.selectedTimeSlot : null,
                                    ]}
                                >
                                    <Text style={styles.timeText}>{item.time}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <Text style={styles.noAvailabilityText}>Booking is not available on this date.</Text>
                    )}
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                    <Ionicons name="trash-outline" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveChangesButton} onPress={handleSubmit}>
                    <Ionicons name="save-outline" size={18} color="white" />
                    <Text style={styles.saveChangesButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
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
    timeSlot: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
        minHeight: 40,
    },
    selectedTimeSlot: {
        backgroundColor: 'cyan',
    },
    timeText: {
        fontSize: 16,
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
        marginLeft: 10,
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
        marginRight: 40,
        marginLeft: 0,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    removeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        // alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: 50,
        marginLeft: 50,
        // flex: 1,
    },
    removeButtonText: {
        color: 'white',
        marginLeft: 10,
    },
    noAvailabilityText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default SetSchedule;
