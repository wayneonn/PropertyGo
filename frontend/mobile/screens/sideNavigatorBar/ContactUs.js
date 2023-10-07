import React, {useContext, useState} from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';
import {createContactUs} from '../../utils/contactUsApi';
import {AuthContext} from '../../AuthContext';

const ContactUs = ({navigation, route}) => {
    const [reason, setReason] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const reasonOptions = ['General', 'Support', 'Feedback', 'Other'];
    const {user} = useContext(AuthContext);

    const handleSubmit = () => {
        if (!reason || !title || !description) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        // Log the output
        console.log('Reason:', reason);
        console.log('Title:', title);
        console.log('Description:', description);

        const contactUsData = {
            title: title,
            message: description,
            reason: reason.toUpperCase(), // Choose one of the allowed values: 'GENERAL', 'SUPPORT', 'FEEDBACK', 'OTHERS'
            status: 'PENDING', // Choose one of the allowed values: 'PENDING', 'REPLIED'
        };

        // console.log(contactUsData);

        createContactUs(user.user.userId, contactUsData)
            .then((response) => {
                toggleModal();
                console.log('ContactUs created:', response);
            })
            .catch((error) => {
                Alert.alert('Error', 'Error Submitting');
                console.error('Error creating ContactUs:', error);
            });


        // Clear the form
        setTitle('');
        setDescription('');
        setReason('');
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        navigation.navigate('ContactUs Status')
        toggleModal();
    };

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView style={styles.formContainer}>
                <Text style={styles.header}>Contact Us</Text>
                <Text style={styles.subheader}>We would love to hear from you!</Text>

                <Text style={styles.label}>Select a reason:</Text>
                <Picker
                    selectedValue={reason}
                    onValueChange={(itemValue) => setReason(itemValue)}
                    style={styles.picker}
                >
                    {reasonOptions.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item}/>
                    ))}
                </Picker>

                <Text style={styles.label}>Title:</Text>
                <TextInput
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    style={styles.input}
                    placeholder="Enter a title"
                />

                <Text style={styles.label}>Description:</Text>
                <TextInput
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    style={[styles.input, styles.descriptionInput]}
                    multiline={true}
                    placeholder="Enter your description"
                />

                <TouchableHighlight
                    style={styles.submitButton}
                    underlayColor="#FFC94E" // Highlight color when pressed
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableHighlight>
                {/* Company address and social media icons */}
                <View style={styles.companyInfoContainer}>
                    <Text style={styles.companyAddress}>123 Cecil Street</Text>
                    <Text style={styles.companyEmail}>Inquiry@PropertyGo.com</Text>
                    <View style={styles.socialMediaContainer}>
                        <Ionicons name="logo-facebook" size={32} color="#0078D4"/>
                        <Ionicons name="logo-twitter" size={32} color="#1DA1F2"/>
                        <Ionicons name="logo-instagram" size={32} color="#E1306C"/>
                    </View>
                </View>
            </ScrollView>

            {/* Modal for feedback */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Thank you for your submission!</Text>
                        <Text style={styles.subText}>You can expect to hear from us within a week.</Text>
                        <TouchableHighlight
                            style={styles.modalButton}
                            underlayColor="#FFC94E" // Highlight color when pressed
                            onPress={closeModal}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    subheader: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginTop: 10,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#FFD700',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    feedbackContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    successMessage: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    goBackButton: {
        backgroundColor: '#FFD700',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    subText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#FFD700',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    companyInfoContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    companyAddress: {
        fontSize: 16,
        marginVertical: 10,
    },
    companyEmail: {
        fontSize: 16,
        marginBottom: 20,
    },
    socialMediaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
});

export default ContactUs;
