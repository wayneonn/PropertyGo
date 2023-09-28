import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {fetchPartnerApplication} from "../../utils/partnerApplicationApi";
import {AuthContext} from "../../AuthContext";

const IntroScreen = () => {
    const [partner, setPartner] = useState([]); // Local state to keep track of selected documents
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }
        ).start();
    }, [fadeAnim]);

    useEffect(() => {
        fetchPartnerAppFromServer().then(r => console.log("Fetch Partner Applications completed."));
    }, []);

    useEffect(() => {
        console.log("Partner state has been updated:", partner);
    }, [partner]);


    // I am under the assumption that only application is to be submitted, so if there is already an application you should not be spamming.
    // Honestly should be the case that no application = sign up, false = wait, true = congrats.
    const fetchPartnerAppFromServer = async () => {
        try {
            const partnerApp = await fetchPartnerApplication(USER_ID)
            console.log(partnerApp.partnerApp);
            console.log(partnerApp.partnerApp[0].approved);
            setPartner([...partnerApp.partnerApp]);
            console.log(partner);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <View style={styles.container}>
            {partner.length !== 0 ? (
                partner.approved ? (
                    <View style={styles.box}>
                        <Text style={styles.title}>Your Application is successful, welcome to the team!</Text>
                        <Text style={styles.subtitle}>View your profile to see what else you can do as a
                            partner. </Text>
                    </View>
                ) : (
                    <View style={styles.box}>
                        <Text style={styles.title}>Wait for your application to be approved.</Text>
                        <Text style={styles.subtitle}>We love to have you join our platform, but we need time. Hope to
                            see you with us soon.</Text>
                    </View>
                )
            ) : (
                <View>
                    <Animated.View style={styles.box}>
                        <Text style={styles.title}>Join us as a Partner today.</Text>
                        <Text style={styles.subtitle}>Let's get started on your journey to working on our
                            platform.</Text>
                    </Animated.View>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Company Info')}>
                        <Text style={styles.buttonText}>Start Application</Text>
                        <AntDesign name="arrowright" size={20} color="black"/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    box: {
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        fontStyle: "italic",
        color: '#666',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
    },
});

export default IntroScreen;
