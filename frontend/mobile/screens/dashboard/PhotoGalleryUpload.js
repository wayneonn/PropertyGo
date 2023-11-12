import {ImageUpload} from "../../components/Partner/ImageUpload";
import {ImageDisplayComponent} from "../../components/Partner/ImageDisplay"
import React, {useState} from "react";
import {ScrollView, Text, Image, StyleSheet, View, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";



export const PhotoGalleryUpload = ({navigation}) => {
    const [image, setImage] = useState([])
    return (
        <ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <Text style={styles.header}>Previously Uploaded Photos: </Text>
            </View>
            <View style={styles.calendarContainer}>
                <View style={styles.calendar}>
                    <ImageDisplayComponent/>
                </View>
            </View>
            {/*<View style={{width: '100%',*/}
            {/*    height: '60%',*/}
            {/*    overflow: 'hidden'}}>*/}
            {/*    <Image style={{width: '100%',*/}
            {/*        height: '100%',*/}
            {/*        borderRadius: 10}} source={{ uri: `http://localhost:3000/image/4` }} />*/}
            {/*</View>*/}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Upload Photos:</Text>
            </View>
            <View style={styles.calendarContainer}>
                <View style={styles.calendar}>
                    <ImageUpload images={image} setImages={setImage}/>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 5, // Adjust the top position as needed
        left: 16, // Adjust the left position as needed
        zIndex: 1, // Place it above the swiper
    },
    headerContainer: {
        marginBottom: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
    calendarContainer: {
        borderRadius: 8,
        marginBottom: 10,
    },
    calendar: {
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: 'white',
        padding: 10
    },
    dateCard: {
        // backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 8,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.1,
    },
    dateText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 10,
        textAlign: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noAvailabilityText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    bookingContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        borderWidth: 0.2,
        borderColor: 'gray',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 20, // Add padding to make the button visible
    },
    picker: {
        backgroundColor: 'white',
    },
    okButtonContainer: {
        backgroundColor: 'white',
    },
    propertyTypePickerButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: 'gray',
        fontSize: 14,
        padding: 8,
        width: '40%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    propertyTypePickerText: {
        fontSize: 14,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

});