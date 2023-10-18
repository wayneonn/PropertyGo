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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';
import { getScheduleByUserId, getScheduleBySellerId } from '../../../utils/scheduleApi';
import ScheduleCard from '../../schedule/ScheduleCard';
import { useFocusEffect } from '@react-navigation/native';

const Appointments = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [userBuySchedules, setUserBuySchedules] = useState([]); // Schedules for "To Buy"
    const [sellerSellSchedules, setSellerSellSchedules] = useState([]); // Schedules for "To Sell"

    useEffect(() => {
        fetchScheduleByUser();
        fetchScheduleBySeller();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // console.log('Home page gained focus');
            fetchScheduleByUser();
            fetchScheduleBySeller();
        }, [])
    );

    const fetchScheduleByUser = async () => {
        const { success, data, message } = await getScheduleByUserId(
            user.user.userId
        );

        if (success) {
            // Filter schedules for "To Buy" with meetupDate today or in the future
            const today = new Date();
            const userSchedulesTodayAndBeyond = data.filter(schedule => new Date(schedule.meetupDate) >= today);
            setUserBuySchedules(userSchedulesTodayAndBeyond);
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
            // Filter schedules for "To Sell" with meetupDate today or in the future
            const today = new Date();
            const sellerSchedulesTodayAndBeyond = data.filter(schedule => new Date(schedule.meetupDate) >= today);
            setSellerSellSchedules(sellerSchedulesTodayAndBeyond);
        } else {
            setSellerSellSchedules([]);
            console.error('Error fetching schedule data for user:', message);
        }
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
                    <Text style={styles.header}>Appointment Agenda</Text>
                </View>

                {/* Container for today's agenda */}
                <View style={styles.todayAgendaContainer}>
                    <Text style={styles.dateOnContainer}>Today's Agenda</Text>

                    {/* List of user's and seller's bookings for today */}
                    {userBuySchedules.length > 0 || sellerSellSchedules.length > 0 ? (
                        <>
                            {userBuySchedules.map((item) => (
                                <ScheduleCard key={item.scheduleId} schedule={item} onPress={() => {
                                    navigation.navigate('View Profile', { userId: item.sellerId });
                                }} />
                            ))}
                            {sellerSellSchedules.map((item) => (
                                <ScheduleCard key={item.scheduleId} schedule={item} onPress={() => {
                                    navigation.navigate('View Profile', { userId: item.sellerId });
                                }} />
                            ))}
                        </>
                    ) : (
                        <Text style={styles.noAvailabilityText}>No bookings found.</Text>
                    )}
                </View>

                {/* Container for "To Buy" */}
                <View style={styles.buyContainer}>
                    <Text style={styles.dateOnContainer}>To Buy - Upcoming To View</Text>

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

                {/* Container for "To Sell" */}
                <View style={styles.sellContainer}>
                    <Text style={styles.dateOnContainer}>To Sell - Buyers To View Unit</Text>

                    {/* List of user's bookings */}
                    {sellerSellSchedules && sellerSellSchedules.length > 0 ? (
                        <FlatList
                            data={sellerSellSchedules}
                            keyExtractor={(item) => item.scheduleId.toString()}
                            renderItem={({ item }) => (
                                <ScheduleCard schedule={item} onPress={() => {
                                    navigation.navigate('View Profile', { userId: item.sellerId });
                                }} />
                            )}
                        />
                    ) : (
                        <Text style={styles.noAvailabilityText}>No bookings for units listed.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
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
});

export default Appointments;
