import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated, FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {fetchPartnerApplication} from "../../utils/partnerApplicationApi";
import {fetchDocumentById} from "../../utils/documentApi";
import {AuthContext} from "../../AuthContext";
// import Divider from "../../components/Common/Divider";

// EXPERIMENTING FOR UI STYLING.
import { Button, Text, Divider } from '@rneui/themed';


/*
* InfoScreen is supposed to introduce the applicant to the Partner Application process.
* 1. The InfoScreen shows a "Welcome" message if there is no Partner Application detected from the server.
* 2a. InfoScreen shows a "Wait" message if there is a PartnerApp in the server.
* 2b. InfoScreen shows an additional "Upload Document" button if there isn't a Document in the server.
* 3. InfoScreen shows an "Approved" message once the Partner Application is approved.
*
*
*
*
* */
const IntroScreen = () => {
    const [partnerAppId, setPartnerAppId] = useState(0)
    const [partner, setPartner] = useState([]); // Local state to keep track of selected documents
    const [documentsValid, setDocumentsValid] = useState(false);
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const {user} = useContext(AuthContext);
    const USER_ID = user.user.userId;
    const isFocused = useIsFocused();


    // This does not work properly.
    useEffect(() => {
        console.log("Changed focus: ", isFocused);
        if (isFocused) {
            console.log('Screen is focused, re-rendering...');
            fetchPartnerAppFromServer().then(r => console.log("Fetch Partner Applications completed."));
        }
    }, [isFocused]);

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
        console.log("Focused state: ", isFocused);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Your API call or other logic here
            console.log('Polling API...');
            fetchPartnerAppFromServer().then(r => console.log("Data polled from API."))
        }, 5000); // Polls every 5 seconds
        return () => {
            clearInterval(intervalId); // Cleanup when the component unmounts
        };
    }, []);

    useEffect(() => {
        console.log("Partner state has been updated:", partner);
    }, [partner]);

    useEffect(() => {
        console.log("Partner Application ID updated: ", partnerAppId)
    }, []);


    /**
     * Description: Fetch partner application + partner application documents from the server.
     * Only one application allowed per user -> doesn't make sense to apply for more?
     *
     *
     * **/
    const fetchPartnerAppFromServer = async () => {
        try {
            const partnerApp = await fetchPartnerApplication(USER_ID)
            console.log("Fetched partner apps from server: ", partnerApp.partnerApp);
            if (partnerApp.partnerApp.length !== 0) {
                const appDocuments = await fetchDocumentById(partnerApp.partnerApp[0].partnerApplicationId)
                setPartnerAppId(partnerApp.partnerApp[0].partnerApplicationId);
                console.log("Fetched application documents from server: ", appDocuments)
                if (appDocuments.length === 0) {
                    setDocumentsValid(false)
                } else {
                    setDocumentsValid(true)
                }
            }
            setPartner([...partnerApp.partnerApp]);
        } catch (error) {
            console.error(error);
        }
    };

    /**
    * Display the status of an approval.
    * 1. Input -> {} in partner [].
    * 2. Output -> Single field in the Approval.
    * 3. Possible options: Document submission should be tied to it?
    * **/
    const renderPartnerApp = ({item}) => (
        <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
            <Text>Application ID: {item.partnerApplicationId}</Text>
            <Text>User Role: {item.userRole}</Text>
            <Text>Approval Status: {item.approved ? 'Yes' : 'No'} </Text>
            <Text>Documents Submitted: {documentsValid ? 'Yes' : 'No'} </Text>
            <Text>Notes from Admin: {item.adminNotes} </Text>
        </View>
    );

    const CustomTitle = () => {
        return (
            <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color:"white"}}>Let's Start!</Text>
                <Text style={{ fontStyle: 'italic', fontSize: 12, color:"white" }}>
                    Press next to begin.
                </Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            {partner.length !== 0 ? (
                partner[0].approved ? (
                    <View style={styles.box}>
                        <Text style={styles.titleApproved}>Your Application is successful, welcome to the team!</Text>
                        <Text style={styles.subtitle}>View your profile to see what else you can do as a partner.</Text>
                        <Text>&nbsp;</Text>
                        <Button onPress={() => navigation.navigate('User Profile')}>
                            <Text style={styles.buttonText}> View Profile </Text>
                            <AntDesign name="arrowright" size={20} color="black"/>
                        </Button>
                    </View>
                ) : (
                    <View style={styles.box}>
                        <Text style={styles.titlePending}>Wait for your application to be approved.</Text>
                        <Text style={styles.subtitle}>We love to have you join our platform, but we need time. Hope to
                            see you with us soon.</Text>
                        <Text>&nbsp;</Text>
                        <Divider/>
                        <Text>&nbsp;</Text>
                        <Text> This is the status of your current application. </Text>
                        <FlatList data={partner} renderItem={renderPartnerApp}
                                  keyExtractor={item => item.partnerApplicationId}/>
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
                        <Text>&nbsp;</Text>
                        <Text style={styles.subtitle}>Let's get started on your journey to working on our
                            platform - be a lawyer, contractor or property agent.</Text>
                    </Animated.View>
                    <Divider inset={true} insetType="right" />
                    <Button
                        title={<CustomTitle />}
                        titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
                        buttonStyle={{
                            borderWidth: 0,
                            borderColor: 'transparent',
                            borderRadius: 20,
                        }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            color: "#5F5859"
                        }}
                        icon={{
                            name: 'arrow-right',
                            type: 'font-awesome',
                            size: 15,
                            color: 'white',
                        }}
                        iconRight
                        iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
                        color={"#5F5859"}
                        onPress={() => navigation.navigate("Company Info")}
                    />
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
        color: '#92898A',
        lineHeight: 40,
    },
    titlePending: {
        fontSize: 34,
        fontWeight: '700',
        color: '#AF9FA5',
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
        backgroundColor: '#5F5859',
        paddingVertical: 20,
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
