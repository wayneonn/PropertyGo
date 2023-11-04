import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const Chat = ({ navigation }) => {

    return (
        <View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text>Chat</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    tokenAmountText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 130,
        marginTop: 15,
    },
    backButton: {
        position: 'absolute',
        top: 16, // Adjust the top position as needed
        left: 16, // Adjust the left position as needed
        zIndex: 1, // Place it above the swiper
      },
      helpIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    
    modal: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 10,
        padding: 20,
    },
    
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    
    modalHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    helpText: {
        fontSize: 16,
        marginBottom: 20,
    },
    sectionDescription: {
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    headerDescription: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default Chat;
