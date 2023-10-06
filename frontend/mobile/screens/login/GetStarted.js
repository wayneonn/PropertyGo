import React, {useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';

const GetStarted = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const data = [
        {header: 'Welcome To PropertyGo!', description: 'Home Ownership. Simplified.'},
        {
            header: 'REALISE YOUR DREAM HOME WITH US',
            description: 'Embark on a journey with us to discover your dream property, as we guide you through every step towards transforming it into your ideal home.'
        },
        {
            header: 'SEAMLESS COMMUNICATION',
            description: 'Communicate directly with potential buyers or sellers through the app. Make offers, negotiate terms, and finalize deals effortlessly.'
        },
        {
            header: 'TRUSTED PARTNERSHIPS',
            description: 'We have forged partnerships with contractors, lawyers, interior designers, carpenters, and plumbers.'
        },
    ];

    const handleSwipe = (index) => {
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image source={require('../../assets/getStarted-house.png')} style={styles.icon}/>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                        handleSwipe(newIndex);
                    }}
                    scrollEventThrottle={16}
                >
                    {data.map((item, index) => (
                        <View key={index} style={styles.textContainer}>
                            <Text style={styles.header}>{item.header}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.bubbleContainer}>
                    {data.map((_, index) => (
                        <TouchableOpacity key={index} onPress={() => handleSwipe(index)}
                                          style={[styles.bubble, currentIndex === index && styles.activeBubble]}/>
                    ))}
                </View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login Portal')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFF00',
    },
    contentContainer: {
        alignItems: 'center',
    },
    icon: {
        width: width * 0.5,
        height: height * 0.3,
        resizeMode: 'contain',
        marginTop: 20,
        marginBottom: -10,
    },
    textContainer: {
        width,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingLeft: 50,
        paddingRight: 50,
    },
    header: {
        fontSize: RFValue(20, 680),
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        padding: 10,
    },
    description: {
        fontSize: RFValue(15, 680),
        textAlign: 'center',

    },
    bubbleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    bubble: {
        width: 10,
        height: 10,
        marginHorizontal: 5, // Adjust margin to keep bubbles closer
        borderRadius: 5,
        backgroundColor: '#C0C0C0',
        marginTop: 20,
    },
    activeBubble: {
        backgroundColor: '#000',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#000',
        width: width * 0.5,
        marginTop: 20,
        marginBottom: 170,
    },
    buttonText: {
        color: '#fff',
        fontSize: RFValue(16, 680),
    },
});

export default GetStarted;
