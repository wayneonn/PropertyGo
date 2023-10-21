import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, RefreshControl } from 'react-native';
import NotificationItem from '../../components/Notification/NotificationItem';


const Activity = () => {


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Activity</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filter}>Filter</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {/* <Text>ActivityScreen</Text> */}
                <NotificationItem />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Activity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // backgroundColor: 'transparent'
        // borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
          height: 30,
        //   borderWidth:1,
        //   paddingEnd: 5,
        marginVertical: 5,
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