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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ScheduleCard from './ScheduleCard'; 
import {
    createViewingAvailability, getViewingAvailabilityByDateAndPropertyId,
    getViewingAvailabilityByPropertyId, removeViewingAvailability, 
    updateViewingAvailability, getScheduleByPropertyId
} from '../../utils/scheduleApi';
import AppointmentCard from './AppointmentCard';

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
    // Define selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availability, setAvailability] = useState([]);
    const [isToBeUpdated, setIsToBeUpdated] = useState(false);
    const [viewingAvailabilityId, setViewingAvailabilityId] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        fetchViewingAvailabilityByDateAndPropertyId();
        fetchViewingAvailabilityByPropertyId();
        fetchScheduleByProperty();

    }, [selectedDate, isToBeUpdated]);

    const getTodayDate = () => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Singapore', // Specify the time zone for Singapore
        };
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toLocaleString('en-SG', options);
        const parts = todayString.split('/');
        let todayDate;
        if (parts.length === 3) {
            const dd = parts[0].padStart(2, '0');
            const mm = parts[1].padStart(2, '0');
            const yyyy = parts[2];
            todayDate = `${yyyy}-${mm}-${dd}`;
        }
        return todayDate;
    }

    const fetchScheduleByProperty = async () => {
        const { success, data, message } = await getScheduleByPropertyId(
            propertyListingId
        );

        if (success) {
            const currentDate = new Date();
            const filteredSchedules = data.filter(schedule => currentDate <= new Date(schedule.meetupDate) && schedule.propertyId === propertyListingId);
            setBookedSlots(filteredSchedules);
        } else {
            setBookedSlots([]);
            console.error('Error fetching schedule data for user:', message);
        }
    };

    const sortedSchedules = [...bookedSlots];
    sortedSchedules.sort((a, b) => {
        // Sort by meetup date first
        const dateA = new Date(a.meetupDate);
        const dateB = new Date(b.meetupDate);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // If meetup dates are the same, sort by time
        const timeA = a.meetupTime;
        const timeB = b.meetupTime;
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        return 0;
    });


    const fetchViewingAvailabilityByDateAndPropertyId = async () => {
        console.log('selectedDate: ', selectedDate)
        const { success, data, message } = await getViewingAvailabilityByDateAndPropertyId(
            selectedDate,
            propertyListingId
        );

        if (success) {
            // console.log('data: ', data);

            setIsToBeUpdated(true);
            setStartTimePickerDisplay(convertTimeTo12HourFormat(data[0].startTimeSlot))
            setEndTimePickerDisplay(convertTimeTo12HourFormat(data[0].endTimeSlot))
            setStartTime(convertToDateTime(data[0].startTimeSlot))
            setEndTime(convertToDateTime(data[0].endTimeSlot))
            setViewingAvailabilityId(data[0].viewingAvailabilityId)
        } else {
            console.error('Error:', message);
            setIsToBeUpdated(false);
            setStartTimePickerDisplay(null);
            setEndTimePickerDisplay(null);
        }
    }

    const convertToDateTime = (timeString) => {

        const [hours, minutes, seconds] = timeString.split(':');
        const formattedDate = new Date();
        formattedDate.setHours(parseInt(hours, 10));
        formattedDate.setMinutes(parseInt(minutes, 10));
        formattedDate.setSeconds(parseInt(seconds, 10));

        console.log("convertToDateTime: ", formattedDate)
        return formattedDate;
    }

    const fetchViewingAvailabilityByPropertyId = async () => {
        // console.log('selectedDate: ', selectedDate)
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
    }

    // Function to handle time slot selection
    const handleTimeSlotSelect = (time) => {
        if (!startTime) {
            setStartTimePickerVisible(true);
        } else if (!endTime) {
            setEndTimePickerVisible(true);
        }
    };

    function convertTimeTo12HourFormat(time) {
        const [hours, minutes, seconds] = time.split(":");
        let period = "AM";
        let formattedHours = parseInt(hours);

        if (formattedHours >= 12) {
            period = "PM";
            if (formattedHours > 12) {
                formattedHours -= 12;
            }
        }

        return `${formattedHours}:${minutes} ${period}`;
    }

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
        if (!selectedDate || !startTimePickerDisplay || !endTimePickerDisplay) {
            // Check if all fields are filled
            Alert.alert('Incomplete Information', 'Please select a date, start time, and end time.');
            return;
        }
        console.log("selectedDate --", selectedDate)
        // Create the viewing availability object to be submitted
        const availabilityData = {
            propertyListingId: propertyListingId,
            date: selectedDate,
            // date: selectedDate.toISOString().slice(0, 10), // Extract and format date component as DATEONLY
            startTimeSlot: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            endTimeSlot: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // Extract and format time component as TIME
        };

        // Call the API to create the viewing availability
        // Replace createViewingAvailability with your actual API call

        if (isToBeUpdated == false) {
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
        } else {
            const response = await updateViewingAvailability(availabilityData, viewingAvailabilityId);
            if (response.success) {
                // Show a success alert
                Alert.alert('Success', 'Availability successfully updated.');

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
                console.log("Error: ", response.message)
            }
            console.log("Not to be updated");
        }

        fetchViewingAvailabilityByPropertyId();
        fetchScheduleByProperty();
    };

    const handleRemove = async () => {
            const response = await removeViewingAvailability(viewingAvailabilityId);
            console.log("response on removeViewingAvailability", response)
            if (response.success) {
                // Show a success alert
                Alert.alert('Success', 'Availability successfully removed.');

                // Clear selected time and time range
                setSelectedTime(null);
                setStartTime(null);
                setEndTime(null);

                // Refresh the screen to reflect the new date
                setSelectedDate(new Date());
                // fetchViewingAvailabilityByPropertyId()
            } else {
                Alert.alert('Error', 'Failed to remove availability. Please try again later.');
                console.log("Error: ", response.message)
            }

            fetchViewingAvailabilityByPropertyId();
            fetchScheduleByProperty();
    };

    const getMarkedDates = () => {
        const markedDates = {};
        const seller = { key: 'seller', color: 'red' };

        if(availability.length == 0){
            markedDates[selectedDate] = { selected: true, selectedColor: 'blue' };
        }

        // Loop through the data and mark the dates
        availability.forEach((availability) => {
            const date = availability.date; // Get the date from the fetched data
            markedDates[date] = { dots: [] };
            // Specify how you want to mark the date

            markedDates[date] = { selected: true, selectedColor: 'green' };
            markedDates[selectedDate] = { selected: true, selectedColor: 'blue' };
        });

        bookedSlots.forEach((userSlot) => {
            const date = userSlot.meetupDate;
            if (!markedDates[date]) {
                markedDates[date] = { dots: [] }; // Create a new entry with an empty dots array
            } else if (!markedDates[date].dots) {
                markedDates[date].dots = []; // If dots array doesn't exist, create it
            }
            markedDates[date].dots.push(seller);
            
            if (date === selectedDate) {
                markedDates[date].selected = true;
                markedDates[date].selectedDotColor = 'blue';
            }
        });

        return markedDates;
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
                        onMonthChange={handleDayPress}
                        markingType={'multi-dot'}
                        minDate={new Date()}
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

                <View style={styles.timeSlotsContainer}>
                <Text style={styles.dateOnContainer}>
                        <Ionicons name="calendar" size={28} color="#00adf5" />
                        {" "}{formatDate(selectedDate)}
                    </Text>
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
                <View style={styles.bookingContainer}>
                <Text style={styles.dateOnContainer}>
                        <MaterialCommunityIcons
                            name="table-eye"
                            size={28}
                            color="#00adf5"
                        />{' '}
                        Upcoming Buyers</Text>

                    {/* List of user's bookings */}
                    {bookedSlots && bookedSlots.length > 0 ? (
                        <>
                        {sortedSchedules.map((item) => (
                            <AppointmentCard schedule={item} propertyId={item.propertyId} onPress={() => {
                                navigation.navigate('View Appointment Detail', { userId: item.userId, propertyId: item.propertyId, scheduleId: item.scheduleId });
                            }} />
                        ))}
                    </>                   
                    ) : (
                        <Text style={styles.noAvailabilityText}>There are no bookings for any viewings. </Text>
                    )}
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                    <Ionicons name="trash-outline" size={18} color="white" />
                    {/* <Text style={styles.removeButtonText}>Remove</Text> */}
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
        fontSize: 13,
    },
    dateOnContainer: {
        fontSize: 25,
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
        marginLeft: 0,
        marginTop: 0,
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
    bookingContainer: {
        flex: 1,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        borderWidth: 0.2,
        borderColor: 'gray',
        marginBottom: 10,
    },
    bookingItem: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    bookingItemText: {
        fontSize: 16,
        marginBottom: 8,
    },
    bookingItemTextLabel: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    noAvailabilityText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default SetSchedule;
