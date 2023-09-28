import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

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

    return (
        <View style={styles.container}>
            <Animated.View style={{ ...styles.box, opacity: fadeAnim }}>
                <Text style={styles.title}>Join us as a Partner today.</Text>
                <Text style={styles.subtitle}>Let's get started on your journey to working on our platform.</Text>
            </Animated.View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Company Info')}>
                <Text style={styles.buttonText}>Start Application</Text>
                <AntDesign name="arrowright" size={20} color="black" />
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
    box: {
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingHorizontal: 8,
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
