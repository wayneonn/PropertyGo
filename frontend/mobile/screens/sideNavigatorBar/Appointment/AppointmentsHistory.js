import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../../../AuthContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
    createSchedule,
    getViewingAvailabilityByDateAndPropertyId,
    getViewingAvailabilityByPropertyId,
    removeViewingAvailability,
    updateViewingAvailability,
    getScheduleByDateAndPropertyId,
    updateSchedule,
    removeSchedule,
    getScheduleByUserId,
    getScheduleBySellerId,
} from '../../../utils/scheduleApi';
import { set } from 'date-fns';
import ScheduleCard from '../../schedule/ScheduleCard';

const Appointments = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const userId = user.user.userId;
    // const sellerUserId = userDetails.userId;
    // Define selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availability, setAvailability] = useState([]);
    const [isToBeUpdated, setIsToBeUpdated] = useState(false);
    const [viewingAvailabilityId, setViewingAvailabilityId] = useState(null);
    const [scheduleId, setScheduleId] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);
    const [timeSlots, setTimeSlots] = useState([]);
    const [takenTimeSlots, setTakenTimeSlots] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [pastDate, setPastDate] = useState(currentDate.setDate(currentDate.getDate() - 2));
    const [refreshFlatList, setRefreshFlatList] = useState(false);
    const [userSlots, setUserSlots] = useState([]);
    const [sellerSlots, setSellerSlots] = useState([]);
    const [userBuySchedules, setUserBuySchedules] = useState([]); // Schedules for "To Buy"
    const [sellerSellSchedules, setSellerSellSchedules] = useState([]); // Schedules for "To Sell"

    const numColumns = 3;

    useEffect(() => {
        // fetchViewingAvailabilityByDateAndPropertyId();
        // fetchViewingAvailabilityByPropertyId();
        // fetchScheduleData();
        fetchScheduleByUser();
        fetchScheduleBySeller();
    }, [selectedDate]);


    useEffect(() => {
        if (firstLoad) {
            setTimeSlots(generateTimeSlots());
            console.log("timeslots: ", generateTimeSlots())
        }
    }, []);

    const fetchScheduleByUser = async () => {
        const { success, data, message } = await getScheduleByUserId(
            userId
        );

        if (success) {
            setUserSlots(data);
            console.log("fetchScheduleByUser", data)
        } else {
            setUserSlots([]);
            console.error('Error fetching schedule data for user:', message);
        }
    };

    const fetchScheduleBySeller = async () => {
        const { success, data, message } = await getScheduleBySellerId(
            userId
        );

        if (success) {
            setSellerSlots(data);
            console.log("fetchScheduleByUser", data)
        } else {
            setSellerSlots([]);
            console.error('Error fetching schedule data for user:', message);
        }
    };

    const fetchScheduleData = async () => {
        const { success, data, message } = await getScheduleByDateAndPropertyId(
            selectedDate,
            propertyListingId
        );

        if (success) {
            setTakenTimeSlots(data);
            setIsToBeUpdated(data.some(item => item.userId === userId));
        } else {
            console.error('Error fetching schedule data:', message);
            setTakenTimeSlots([]);
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

    // Function to handle time slot selection
    const handleTimeSlotSelect = (time, scheduleId) => {
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
        setScheduleId(scheduleId);

        // Update the timeSlots array with the new userBooked value for the selected time slot
        setTimeSlots((prevTimeSlots) =>
            prevTimeSlots.map((slot) =>
                slot.time === time ? { ...slot, userBooked: true } : slot
            )
        );
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
        console.log('generateTimeSlots() selectedDate:', selectedDate)
        console.log('generateTimeSlots() startTime: ', startTime)
        console.log('generateTimeSlots() endTime: ', endTime)
        const timeSlots = [];
        let userBookedFlag = false;
        if (startTime && endTime) {
            const startHour = startTime.getHours();
            const endHour = endTime.getHours();
            for (let i = startHour; i <= endHour; i++) {
                const hour = i % 12 || 12; // Convert to 12-hour format
                const ampm = i < 12 ? 'AM' : 'PM';
                const time = `${hour}:00 ${ampm}`;
                const isTimeSlotTaken = takenTimeSlots.some(
                    (takenSlot) => convertTimeTo12HourFormat(takenSlot.meetupTime) === time
                );
                const userBookedSlot = takenTimeSlots.find(
                    (takenSlot) =>
                        takenSlot.userId === userId &&
                        convertTimeTo12HourFormat(takenSlot.meetupTime) === time
                );

                const scheduleId = userBookedSlot ? userBookedSlot.scheduleId : null;

                const isSlotDisabled = !userBookedSlot && isTimeSlotTaken;
                timeSlots.push({
                    id: i.toString(),
                    time,
                    isTimeSlotTaken,
                    userBooked: !!userBookedSlot,
                    isSlotDisabled,
                    scheduleId, // Store the scheduleId if the slot is taken by a user
                });

                if (!!userBookedSlot) {
                    userBookedFlag = true;
                }
            }
            // setUpdateSchedule(userBookedFlag);
        }
        console.log('timeSlots: ', timeSlots, "for: ", selectedDate)
        if (firstLoad) {
            // Display a message for the initial load
            return [
                {
                    id: 'initial-load',
                    time: 'Select a time slot',
                    isSlotDisabled: true,
                    userBooked: false,
                },
            ];
        }

        return timeSlots;
    };


    // Function to handle day press in the calendar
    const handleDayPress = (day) => {
        setFirstLoad(false);
        setSelectedDate(day.dateString);
        setSelectedTime(null); // Clear selected time when a new date is chosen
        setStartTime(null);
        setEndTime(null);
        setCurrentDate(new Date(day.dateString)); // Update the current date

        // Fetch and filter schedules for "To Buy"
        const userBuySchedules = userSlots.filter((schedule) => {
            // Filter schedules for "To Buy" based on date
            return schedule.meetupDate === day.dateString;
        });
        setUserBuySchedules(userBuySchedules);

        // Fetch and filter schedules for "To Sell"
        const sellerSellSchedules = sellerSlots.filter((schedule) => {
            // Filter schedules for "To Sell" based on date
            return schedule.meetupDate === day.dateString;
        });
        setSellerSellSchedules(sellerSellSchedules);
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSubmit = async () => {

        console.log('scheduleId Here: ', scheduleId)

        if (!selectedDate || !selectedTime) {
            // Check if all fields are filled
            Alert.alert('Incomplete Information', 'Please select a date, start time, and end time.');
            return;
        }

        // Create the viewing availability object to be submitted
        const scheduleData = {
            meetupDate: selectedDate,
            meetupTime: selectedSchedule.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            userId: userId,
            propertyId: propertyListingId,
        };

        // Call the API to create or update the viewing availability
        let response;

        if (isToBeUpdated === false) {
            response = await createSchedule(scheduleData);
            if (response.success) {
                Alert.alert('Success', 'Schedule booked successfully.');
                setSelectedTime(null);
                setSelectedDate(selectedDate);
            } else {
                Alert.alert('Error', 'Failed to book. Please try again later.');
            }
        } else {
            response = await updateSchedule(scheduleData, userId, selectedDate);
            if (response.success) {
                Alert.alert('Success', 'Schedule updated successfully.');
                setSelectedTime(null);
                setSelectedDate(selectedDate);
            } else {
                Alert.alert('Error', 'Failed to update. Please try again later.');
            }
        }

        setTimeSlots(generateTimeSlots());
        setRefreshFlatList((prev) => !prev);
        fetchScheduleData();
        fetchScheduleByUser();
    };

    const handleRemove = async () => {
        console.log('scheduleId: ', scheduleId)
        if (scheduleId) {
            const response = await removeSchedule(scheduleId);
            if (response.success) {
                // Show a success alert
                Alert.alert('Success', 'Availability successfully removed.');

                // Clear selected time and time range
                setSelectedTime(null);
                setScheduleId(null);
                setIsToBeUpdated(false);

                // Refresh the screen to reflect the new date
                // setSelectedDate(new Date());
            } else {
                Alert.alert('Error', 'Failed to remove availability. Please try again later.');
                console.log('Error:', response.message);
            }
        } else {
            Alert.alert('No Availability to Remove', 'There is no availability to remove for the selected date.');
        }

        fetchScheduleData();
        fetchScheduleByUser();
    };

    const getMarkedDates = () => {
        const markedDates = {};
        const seller = { key: 'seller', color: 'red' };
        const buyer = { key: 'buyer', color: 'green' };
    
        if (userSlots.length === 0 || sellerSlots.length === 0) {
            markedDates[selectedDate] = { selected: true, selectedDotColor: 'blue' };
        }
    
        // Loop through the data and mark the dates
        userSlots.forEach((userSlot) => {
            const date = userSlot.meetupDate; // Get the date from the fetched data
    
            if (!markedDates[date]) {
                markedDates[date] = { dots: [] };
            }
            markedDates[date].dots.push(buyer);
    
            if (date === selectedDate) {
                markedDates[date].selected = true;
                markedDates[date].selectedDotColor = 'blue';
            }
        });
    
        sellerSlots.forEach((availability) => {
            const date = availability.meetupDate; // Get the date from the fetched data
    
            if (!markedDates[date]) {
                markedDates[date] = { dots: [] };
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
                keyboardShouldPersistTaps="handled" // Add this prop
            >
                <View style={styles.headerContainer}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Appointment History</Text>
                </View>
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={handleDayPress}
                        maxDate={pastDate}
                        markingType={'multi-dot'}
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
                            extraData={refreshFlatList}
                            keyExtractor={(item) => item.id}
                            numColumns={numColumns}
                            renderItem={({ item }) => (
                                // Conditionally render TouchableOpacity based on isSlotDisabled
                                item.isSlotDisabled ? (
                                    <View style={[
                                        styles.timeSlot,
                                        item.isTimeSlotTaken ? { backgroundColor: 'red' } : null, // Set the background color to red for taken time slots
                                    ]}>
                                        <Text style={styles.timeText}>{item.time}</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => handleTimeSlotSelect(item.time, item.scheduleId)}
                                        style={[
                                            styles.timeSlot,
                                            item.userBooked ? { backgroundColor: 'orange' } : null,
                                            selectedTime === item.time ? styles.selectedTimeSlot : null,
                                        ]}
                                    >
                                        <Text style={styles.timeText}>{item.time}</Text>
                                    </TouchableOpacity>

                                )
                            )}
                        />
                    ) : (
                        <Text style={styles.noAvailabilityText}>Booking is not available on this date.</Text>
                    )}
                </View>
                <View style={styles.bookingContainer}>
                    <Text style={styles.dateOnContainer}>To Buy - Past Viewings</Text>

                    {/* List of user's bookings */}
                    {userBuySchedules && userBuySchedules.length > 0 ? (
                        <FlatList
                            data={userBuySchedules}
                            keyExtractor={(item) => item.scheduleId.toString()}
                            renderItem={({ item }) => (
                                <ScheduleCard schedule={item} onPress={() => {
                                    navigation.navigate('View Profile', { userId: item.sellerId });
                                }} />
                            )}
                        />
                    ) : (
                        <Text style={styles.noAvailabilityText}>No bookings found.</Text>
                    )}
                </View>
                <View style={styles.bookingContainer}>
                    <Text style={styles.dateOnContainer}>To Sell - Past Viewings</Text>

                    {/* List of user's bookings */}
                    {sellerSellSchedules && sellerSellSchedules.length > 0 ? (
                        <FlatList
                            data={sellerSellSchedules}
                            keyExtractor={(item) => item.scheduleId.toString()}
                            renderItem={({ item }) => (
                                <ScheduleCard schedule={item} onPress={() => {
                                    navigation.navigate('View Profile', { userId: sellerUserId });
                                }} />
                            )}
                        />
                    ) : (
                        <Text style={styles.noAvailabilityText}>No bookings for units listed.</Text>
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

});

export default Appointments;
