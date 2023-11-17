import {ImageUpload} from "../../components/Partner/ImageUpload";
import {ImageDisplayComponent} from "../../components/Partner/ImageDisplay"
import React, {useState} from "react";
import {ScrollView, Text, Image, StyleSheet, View, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {CardDivider} from "@rneui/base/dist/Card/Card.Divider";


export const PhotoGalleryUpload = ({navigation}) => {
    const [image, setImage] = useState([])
    return (
        <ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                {/* Back button */}
                <Text>&nbsp;</Text>
                <Text style={styles.header}>     Previously Uploaded Photos: </Text>
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
            <CardDivider/>
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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
        paddingTop: 15, // Adjusted for spacing
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    calendarContainer: {
        borderRadius: 10,
        marginBottom: 20,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    calendar: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 15,
    },
});
