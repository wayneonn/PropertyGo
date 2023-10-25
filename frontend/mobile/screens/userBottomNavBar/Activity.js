import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, RefreshControl } from 'react-native';
import NotificationItem from '../../components/Notification/NotificationItem';
import { AuthContext } from '../../AuthContext';
import { getAllNotification } from '../../utils/notificationApi';
import { useNavigation } from '@react-navigation/native';
import NotificationModal from '../../components/Notification/NotificationModal';


const Activity = ({ parentFetchData }) => {

    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([])
    const [filter, setFilter] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const useParentCallback = useCallback(() => {
        const fetchData = async () => {
            try {
                const notificationData = await getAllNotification(user.user.userId, filter);
                // console.log(notificationData)
                await parentFetchData()
                // console.log("notificationData fetched")
                setNotifications(notificationData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [filter])

    useFocusEffect(useParentCallback);

    const handleNotificationPress = (notification) => {
        if (notification.userNavigationScreen === "forumPost") {
            navigation.navigate('Forum Side Navigator', {
                screen: 'Forum Stack Group',
                params: {
                    screen: "Forum Comment",
                    params: {
                        post: notification.forumPost
                    },
                },
            });
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleFilterPress = async (f) => {
        // console.log(f)
        setFilter(f)
        setModalVisible(!isModalVisible);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        useParentCallback();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Activity</Text>
                <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
                    <Text style={styles.filter}>Filter</Text>
                </TouchableOpacity>
            </View>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={'#FFD700'}
                />
            }>
                {/* {console.log(filter)} */}
                {notifications.map((notification, index) => {
                    // console.log(notification.content); // Log the notification data

                    return (
                        <NotificationItem
                            key={notification.notificationId}
                            onPress={() => handleNotificationPress(notification)}
                            profileImage={notification.userNotification ? notification.userNotification.profileImage : null}
                            content={notification.content}
                            updatedAt={notification.updatedAt}
                            completed={notification.isCompleted}
                            pending={notification.isPending}
                            redirect={notification.userNavigationScreen}
                            hasUserRead={notification.hasUserRead}
                        />
                    );
                })}
                {notifications.length === 0 ? <View><Text style={{marginLeft:5}}> No notification at the moment!</Text></View> : null}
            </ScrollView>
            <NotificationModal isVisible={isModalVisible} onClose={toggleModal} onFilter={handleFilterPress} />
        </SafeAreaView>
    );
};

export default Activity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        // borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        //   borderWidth:1,
        //   paddingEnd: 5,
        margin: 5,
        backgroundColor: "transparent"
    },
    title: {
        fontSize: 18,
        marginHorizontal: 5,
        fontWeight: 'bold', // Add fontWeight to make the title bold
        //   color:"blue"
    },
    filter: {
        fontSize: 18,
        marginHorizontal: 5,
        fontWeight: 'bold', // Add fontWeight to make the title bold
        color: "blue"
    },
    filterButton: {
        paddingHorizontal: 10,
    },
    addItem: {
        alignItems: 'center',
        // paddingEnd: 30,
        marginLeft: 300,
        marginRight: 10,
        // flex:1,
        // borderWidth:1,
        // backgroundColor: "black"
    }
});