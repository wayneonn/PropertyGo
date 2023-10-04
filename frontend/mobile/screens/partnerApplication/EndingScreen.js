// Nice ending screen to the Partner Application.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EndingScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Application Complete!</Text>
            <Text style={styles.subtitle}>Thank you for applying to join our Partner Program.</Text>
            <Text style={styles.description}>
                Your application is now under review. We'll get back to you as soon as possible.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText}>Back to Home</Text>
                <AntDesign name="home" size={20} color="black" />
            </TouchableOpacity>
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 24,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        color: '#999',
        marginBottom: 30,
        textAlign: 'center',
        paddingHorizontal: 20,
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

export default EndingScreen;
