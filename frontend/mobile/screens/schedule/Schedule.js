import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Import the Calendar component
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SetSchedule = ({ route }) => {
    const navigation = useNavigation();
    const [selectedTime, setSelectedTime] = useState(null);

    // Function to handle time slot selection
    const handleTimeSlotSelect = (time) => {
        setSelectedTime(time);
    };

    // Generate time slots from 00:00 to 23:00
    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let i = 0; i < 24; i++) {
            const time = `${i.toString().padStart(2, '0')}:00`;
            timeSlots.push({
                id: i.toString(),
                time,
            });
        }
        return timeSlots;
    };

    // Define the number of columns in the matrix
    const numColumns = 3;

    // Define selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Function to handle day press in the calendar
    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSelectedTime(null); // Clear selected time when a new date is chosen
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSubmit = async () => {

    }

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
                            [selectedDate]: { selected: true, selectedColor: 'blue' }, // Highlight selected date
                            '2023-10-17': { selected: true, selectedColor: 'red' },
                            '2023-10-18': { marked: true },
                            '2023-10-19': { selected: true, selectedColor: 'red' }
                        }}

                    />
                </View>

                {/* Time Slots Matrix (Bottom Half) */}

                <View style={styles.timeSlotsContainer}>
                    <Text style={styles.dateOnContainer}>{formatDate(selectedDate)}</Text>
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
        marginLeft: 30,
        marginTop: 5,
    },
    saveChangesButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center', // Center horizontally
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically
        width: '60%',
        marginLeft: 70,
      },
      saveChangesButtonText: {
        color: 'white',
        marginLeft: 10,
      },
});

export default SetSchedule;
