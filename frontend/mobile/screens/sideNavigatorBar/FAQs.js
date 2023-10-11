import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, useWindowDimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAllBuyerFAQ, getAllSellerFAQ } from '../../utils/faqApi';
import HTML from 'react-native-render-html';

const FAQs = () => {
    const [expandedIndices, setExpandedIndices] = useState([]);
    const [buyerFAQ, setBuyerFAQ] = useState([]);
    const [sellerFAQ, setSellerFAQ] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const windowWidth = useWindowDimensions().width;

    const useFAQCallback = useCallback(() => {
        const fetchData = async () => {
            try {
                const faqSeller = await getAllSellerFAQ();
                const faqBuyer = await getAllBuyerFAQ();
                setBuyerFAQ(faqBuyer);
                setSellerFAQ(faqSeller);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    useFocusEffect(useFAQCallback);

    const toggleFAQ = (index) => {
        if (expandedIndices.includes(index)) {
            setExpandedIndices(expandedIndices.filter((i) => i !== index));
        } else {
            setExpandedIndices([...expandedIndices, index]);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        useFAQCallback();
        setRefreshing(false);
    };

    const toggleAllFAQs = () => {
        if (expandedIndices.length === 0) {
            setExpandedIndices([...Array(sellerFAQ.length + buyerFAQ.length).keys()]);
        } else {
            setExpandedIndices([]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={'black'} />
                }
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>FAQs</Text>
                    <TouchableOpacity onPress={toggleAllFAQs}>

                        {expandedIndices.length === 0 ? <MaterialIcons name="expand" size={30} color="black" /> : <MaterialCommunityIcons name="arrow-collapse-vertical" size={30} color="black" />}

                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Seller</Text>
                {sellerFAQ.map((faq, index) => (
                    <TouchableOpacity key={index} onPress={() => toggleFAQ(index)}>
                        <View style={styles.faqContainer}>
                            <View style={styles.faqHeader}>
                                <View style={styles.question}><HTML source={{
                                    html: `<strong style="font-size: 15px;
                                    ">${faq.question.replace(/<\/?p>/g, '')}</strong>`,
                                }}
                                    contentWidth={windowWidth} /></View>
                                {/* {console.log(faq.question.replace(/<\/?p>/g, ''))} */}
                                <AntDesign
                                    name={expandedIndices.includes(index) ? 'caretup' : 'caretdown'} // Use appropriate icon names
                                    size={20}
                                />
                            </View>
                            {expandedIndices.includes(index) && <Text style={styles.answer}><HTML source={{ html: faq.answer.replace(/<\/?p>/g, '') }} contentWidth={windowWidth} /></Text>}
                        </View>
                    </TouchableOpacity>
                ))}

                <Text style={styles.label}>Buyer</Text>
                {buyerFAQ.map((faq, index) => (
                    <TouchableOpacity key={index} onPress={() => toggleFAQ(index + sellerFAQ.length)}>
                        <View style={styles.faqContainer}>
                            <View style={styles.faqHeader}>
                                <View style={styles.question}><HTML source={{
                                    html: `<strong style="font-size: 15px;
                                    ">${faq.question.replace(/<\/?p>/g, '')}</strong>`,
                                }}
                                    contentWidth={windowWidth} /></View>
                                <AntDesign
                                    name={expandedIndices.includes(index + sellerFAQ.length) ? 'caretup' : 'caretdown'} // Use appropriate icon names
                                    size={20}
                                />
                            </View>
                            {expandedIndices.includes(index + sellerFAQ.length) && <Text style={styles.answer}><HTML source={{ html: faq.answer }} contentWidth={windowWidth} /></Text>}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // backgroundColor: 'white'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        // marginBottom: 15,
        // marginTop: 10,
        marginLeft: 15,
    },
    label: {
        fontSize: 20,
        marginBottom: 10,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    faqContainer: {
        backgroundColor: '#FFD700',
        borderWidth: 1,
        // borderColor: '#ccc',
        padding: 16,
        marginBottom: 5,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal:10,
        // borderWidth:1,
    },
    question: {
        // fontSize: 15,
        // fontWeight: 'bold',
        width: '90%',
        marginRight: 10,
        // borderWidth:1,
        marginBottom: 3,
    },
    answer: {
        fontSize: 14,
        textAlign: "justify",
        marginTop: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        paddingEnd: 15,
        marginVertical: 10,
    },
});

export default FAQs;
