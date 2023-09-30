import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated, Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {fetchPartnerApplication} from "../../utils/partnerApplicationApi";
import {fetchDocuments} from "../../utils/documentApi";
import {AuthContext} from "../../AuthContext";

const IntroScreen = () => {
    const [partner, setPartner] = useState([]); // Local state to keep track of selected documents
    const [documentsValid, setDocumentsValid] = useState(false);
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
            const documents = await fetchDocuments(USER_ID) // Check if users have uploaded docs.
            console.log(documents)
            if (documents.length === 0) {
                setDocumentsValid(false)
            } else {
                setDocumentsValid(true)
            }
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
                        <Text style={styles.titleApproved}>Your Application is successful, welcome to the team!</Text>
                        <Text style={styles.subtitle}>View your profile to see what else you can do as a partner.</Text>
                    </View>
                ) : (
                    <View style={styles.box}>
                        <Text style={styles.titlePending}>Wait for your application to be approved.</Text>
                        <Text style={styles.subtitle}>We love to have you join our platform, but we need time. Hope to
                            see you with us soon.</Text>
                        {!documentsValid &&
                            (<View style={{paddingVertical: 10}}>
                                <Button onPress={() => navigation.navigate('Document Selection')}
                                        title={"Document Selection"}> </Button>
                                <Text style={styles.warningText}>You have not submitted your documents. Please proceed
                                    to the document submission page to submit your documents.</Text>
                            </View>)}
                    </View>
                )
            ) : (
                <View>
                    <Animated.View style={styles.box}>
                        <Text style={styles.titleIntro}>Join us as a Partner today.</Text>
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
}

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
    titleApproved: {
        fontSize: 34,
        fontWeight: '700',
        color: '#007bff',
        lineHeight: 40,
    },
    titlePending: {
        fontSize: 34,
        fontWeight: '700',
        color: '#404040',
        lineHeight: 40,
    },
    titleIntro: {
        fontSize: 34,
        fontWeight: '700',
        color: '#333',
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 20,
        fontStyle: "italic",
        color: '#666',
        lineHeight: 28,
    },
    warningText: {
        fontSize: 12,
        color: 'rgba(255,0,0,0.41)',
        lineHeight: 24,
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
        fontSize: 20,
        fontWeight: '600',
        marginRight: 10,
    },
});

export default IntroScreen;
