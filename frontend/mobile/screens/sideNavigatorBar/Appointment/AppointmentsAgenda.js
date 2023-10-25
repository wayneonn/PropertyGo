import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';
import { getScheduleByUserId, getScheduleBySellerId } from '../../../utils/scheduleApi';
import AppointmentCard from '../../schedule/AppointmentCard';
import { useFocusEffect } from '@react-navigation/native';
import { set } from 'date-fns';

const Appointments = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [userBuySchedules, setUserBuySchedules] = useState([]); // Schedules for "To Buy"
    const [sellerSellSchedules, setSellerSellSchedules] = useState([]); // Schedules for "To Sell"
    const [todayUserBuySchedules, setTodayUserBuySchedules] = useState([]); // Schedules for "To Buy"
    const [todaySellerSellSchedules, setTodaySellerSellSchedules] = useState([]); // Schedules for "To Sell"
    const [isScreenLoaded, setIsScreenLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const combinedSchedulesForToday = [...todayUserBuySchedules, ...todaySellerSellSchedules];
    combinedSchedulesForToday.sort((a, b) => {
        // Sort by meetup date first
        const dateA = new Date(a.meetupDate);
        const dateB = new Date(b.meetupDate);
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

        // If meetup dates are the same, sort by time
        const timeA = a.meetupTime;
        const timeB = b.meetupTime;
        if (timeA > timeB) return -1;
        if (timeA < timeB) return 1;

        return 0;
    });

    useEffect(() => {
        fetchScheduleByUser();
        fetchScheduleBySeller();
        setIsScreenLoaded(true);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // console.log('Home page gained focus');
            fetchScheduleByUser();
            fetchScheduleBySeller();
        }, [])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // 3 seconds in milliseconds

        // Clear the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

    const fetchScheduleByUser = async () => {
        const { success, data, message } = await getScheduleByUserId(
            user.user.userId
        );

        if (success) {
            // Filter schedules for "To Buy" with meetupDate today or in the future
            const today = new Date();
            const todayDate = getTodayDate();
            today.setHours(0, 0, 0, 0);
            const userSchedulesTodayAndBeyond = data.filter(schedule => today <= new Date(schedule.meetupDate));
            const userSchedulesToday = data.filter(schedule => todayDate === schedule.meetupDate.slice(0, 10));
            setUserBuySchedules(userSchedulesTodayAndBeyond);
            setTodayUserBuySchedules(userSchedulesToday);
        } else {
            setUserBuySchedules([]);
            console.error('Error fetching schedule data for user:', message);
        }
    };

    const fetchScheduleBySeller = async () => {
        const { success, data, message } = await getScheduleBySellerId(
            user.user.userId
        );

        if (success) {
            const today = new Date();
            const todayDate = getTodayDate();
            const todayCharacters = todayDate.substring(0, 10); // Extract the first 10 characters in yyyy-dd-mm format
            console.log("today:", todayCharacters);
            console.log("schedule.meetupDate:", data[0].meetupDate);
            const sellerSchedulesTodayAndBeyond = data.filter(schedule => today <= new Date(schedule.meetupDate));
            const sellerSchedulesToday = data.filter(schedule => todayDate === schedule.meetupDate.slice(0, 10));
            setSellerSellSchedules(sellerSchedulesTodayAndBeyond);
            setTodaySellerSellSchedules(sellerSchedulesToday);
        } else {
            setSellerSellSchedules([]);
            console.error('Error fetching schedule data for user:', message);
        }
    };

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

    return (
        <View style={styles.container}>
            {isLoading ? ( // Show loading screen while isLoading is true
                <View style={styles.loadingContainer}>
                    <ActivityIndicator style={styles.activityIndicator} size="large" color="#00adf5" />
                </View>
            ) : ( // Show the main screen when isLoading is false
                isScreenLoaded && (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps="handled" // Add this prop
                    >
                        <View style={styles.headerContainer}>
                            {/* Back button */}
                            <Text style={styles.header}>
                                <Ionicons
                                    name="calendar"
                                    size={28}
                                    color="#000"
                                />{'  '}
                                Your Agenda</Text>
                        </View>

                        {/* Container for today's agenda */}
                        <View style={styles.todayAgendaContainer}>
                            <Text style={styles.dateOnContainer}>
                                <Ionicons
                                    name="calendar"
                                    size={28}
                                    color="#00adf5"
                                />{'  '}
                                Today's Viewings</Text>

                            {/* List of user's and seller's bookings for today */}
                            {combinedSchedulesForToday.length > 0 ? (
                                <>
                                    {combinedSchedulesForToday.map((item) => (
                                        <AppointmentCard schedule={item} propertyId={item.propertyId} onPress={() => {
                                            navigation.navigate('View Appointment Detail', { userId: item.userId, propertyId: item.propertyId, scheduleId: item.scheduleId });
                                        }} />
                                    ))}
                                    {/* {todaySellerSellSchedules.map((item) => (

                                <AppointmentCard schedule={item} propertyId={item.propertyId} onPress={() => {
                                    navigation.navigate('View Appointment Detail', { userId: item.sellerId, propertyId: item.propertyId, scheduleId: item.scheduleId });
                                }} />
                            ))} */}
                                </>
                            ) : (
                                <Text style={styles.noAvailabilityText}>No bookings found.</Text>
                            )}
                        </View>

                        {/* Container for "To Buy" */}


                        {/* Container for "To Sell" */}

                    </ScrollView>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        justifyContent: 'flex-start',
    },
    headerContainer: {
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 5,
        textAlign: 'center',
    },
    backButton: {
        padding: 10,
        marginRight: 20,
    },
    todayAgendaContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        borderWidth: 0.2,
        borderColor: 'gray',
        marginBottom: 10,
    },
    buyContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        borderWidth: 0.2,
        borderColor: 'gray',
        marginBottom: 10,
    },
    sellContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        borderWidth: 0.2,
        borderColor: 'gray',
        marginBottom: 10,
    },
    dateOnContainer: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
    },
    noAvailabilityText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    activityIndicator: {
        marginTop: 300,
    }
});

export default Appointments;
