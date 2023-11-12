import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Dimensions, ActivityIndicator, Button,
    TouchableOpacity, Image,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import dataGovSgLogo from '../../assets/data.gov.sg-logo.png';
import { Entypo, FontAwesome5, MaterialCommunityIcons, Ionicons, FontAwesome, } from '@expo/vector-icons';

const PredictionPriceCard = ({ flatType, town, floorArea, leaseCommenceDate, property }) => {
    const [prices, setPrices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const screenWidth = Dimensions.get('window').width;
    const [viewMode, setViewMode] = useState('year');
    let monthNow;
    let yearNow;
    const [predictedPropertyPriceCurrentDate, setPredictedPropertyPriceCurrentDate] = useState(0);
    const isHigherThanAverage = predictedPropertyPriceCurrentDate > property.price;
    const percentagePriceDifference = (Math.abs(property.price - predictedPropertyPriceCurrentDate) / property.price * 100).toFixed(2);

    const toggleViewMode = () => {
        setViewMode(viewMode === 'year' ? 'monthYear' : 'year');
    };


    const getCurrentYearAndMonth = () => {
        const date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1 };
    };

    const fetchData = async (query) => {
        const response = await fetch(`http://localhost:3000/prediction/property-prices?flatType=${encodeURIComponent(flatType)}&town=${encodeURIComponent(town)}&floor_area_sqm=${floorArea}&year=${query.year}&month=${query.month}&lease_commence_date=${leaseCommenceDate}`);
        const data = await response.json();
        return data.predictedPrice;
    };

    const formatPriceWithCommas = (price) => {
        let formattedPrice = price * 1000;
        formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedPrice = parseFloat(formattedPrice).toFixed(1);
        return formattedPrice;
    };

    function getMonthNameFromNumber(monthNumber) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        if (monthNumber >= 1 && monthNumber <= 12) {
            return monthNames[monthNumber - 1];
        } else {
            return 'Invalid Month';
        }
    }

    useEffect(() => {
        const { year, month } = getCurrentYearAndMonth();
        const dataFetchPromises = [];
        yearNow = year;
        monthNow = month;
        const startYear = year - 1; // Starting 3 years back
        const endYear = year + 3; // Going to 2 years forward
        let currentMonth = month;

        for (let i = 0; i < 8; i++) { // Fetch data for 8 data points (4 years, every 6 months)
            let currentYear = startYear + Math.floor((currentMonth + i * 6 - 1) / 12); // Calculate the current year
            currentMonth = (currentMonth + i * 6 - 1) % 12 + 1; // Calculate the current month

            dataFetchPromises.push(fetchData({ year: currentYear, month: currentMonth }));
        }

        Promise.all(dataFetchPromises).then(fetchedPrices => {
            const chartData = fetchedPrices.map((price, index) => {
                const labelMonth = (currentMonth + index * 6) % 12; // Calculate the month for the label
                const labelYear = startYear + Math.floor((currentMonth + index * 6) / 12); // Calculate the year for the label
                const formattedDate = `${getMonthNameFromNumber(labelMonth)} ${labelYear.toString().slice(-2)}`;
                console.log("labelMonth: ", labelMonth);
                console.log("labelYear: ", labelYear);
                if (labelMonth === monthNow && labelYear === yearNow) {
                    setPredictedPropertyPriceCurrentDate(price)
                    console.log("predictedPropertyPriceCurrentDate: ", predictedPropertyPriceCurrentDate);
                }
                return {
                    value: price / 1000,
                    year: formattedDate,
                    labelComponent: () => (
                        <Text style={styles.yearText}>
                            {"     "}{getMonthNameFromNumber(labelMonth)} {labelYear.toString().slice(-2)}
                        </Text>
                    ),
                };
            });
            setTimeout(() => {
                setPrices(chartData); // Set prices after a delay
                setIsLoading(false); // Update isLoading state to false
            }, 3000); // Delay for 3 seconds
        }).catch(error => {
            console.error('Error fetching prediction data:', error);
        });
    }, [flatType, town, floorArea, leaseCommenceDate]);

    const capitalizeWords = (str) => {
        return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    }

    const dPoint = () => {
        return (
            <View
                style={{
                    width: 14,
                    height: 14,
                    backgroundColor: 'white',
                    borderWidth: 3,
                    borderRadius: 7,
                    borderColor: '#07BAD1',
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PriceGPT</Text>
            {prices.length > 0 && !isLoading ? (
                <>
                    <LineChart
                        isAnimated
                        thickness={5}
                        color="#FFD700"
                        noOfSections={4}
                        animateOnDataChange
                        // hideDataPoints
                        rotateLabel
                        yAxisTextStyle={{ color: 'gray' }}
                        yAxisSide='right'
                        animationDuration={1000}
                        onDataChangeAnimationDuration={500}
                        areaChart
                        pointerConfig={{
                            pointerStripHeight: 160,
                            pointerStripColor: 'lightgray',
                            pointerStripWidth: 2,
                            pointerColor: 'lightgray',
                            radius: 6,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 90,
                            activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: items => {
                                return (
                                    <View
                                        style={{
                                            height: 90,
                                            width: 100,
                                            justifyContent: 'center',
                                            marginTop: -30,
                                            marginLeft: -40,
                                        }}>
                                        <Text style={{ color: 'black', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                                            {items[0].year}
                                        </Text>

                                        <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 5, backgroundColor: 'black' }}>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                                                {'S$ ' + formatPriceWithCommas(items[0].value) + 'k'}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            },
                            labelComponent: () => (
                                <Text style={styles.yearText}>
                                    {"     "}{viewMode === 'year'
                                        ? items[0].year.toString().slice(-2)
                                        : items[0].year}
                                </Text>
                            ),
                        }}
                        pointerLabelComponent
                        data={prices}
                        maxValue={1000}
                        height={200}
                        width={screenWidth - 112}
                        curved
                        noOfSectionsBelowXAxis={0}
                        // hideDataPoints
                        startFillColor={'#FFD700'}
                        endFillColor={'rgb(84,219,234)'}
                        startOpacity={0.4}
                        endOpacity={0.1}
                        // stepValue={100}
                        spacing={58}
                        backgroundColor="white"
                        rulesColor="gray"
                        rulesType="solid"
                        initialSpacing={20}
                        yAxisColor="lightgray"
                        xAxisColor="lightgray"
                        renderYAxisLabel={(value) => `S$ ${value}k`}
                        startFromZero={true}
                    />

                    <View style={styles.bottomButtonsContainer}>
                        {/* <TouchableOpacity style={styles.buyButton} onPress={toggleViewMode}>
                            <Ionicons name="calendar-outline" size={18} color="black" />
                        </TouchableOpacity> */}
                        {/* <Text>Based on our Machine Learning Algorithm,</Text> */}
                    </View>
                    <View style={styles.bottomButtonsContainer}>
                        <Text style={styles.descriptionText}>
                            Based on our knowledge, the average asking price for the property
                            of <Text style={styles.descriptionBold}>{capitalizeWords(property.flatType.toLowerCase().replace(/_/g, ' '))} </Text>
                            listed here is listed
                            at a price of
                            S$<Text style={styles.descriptionBold}>{formatPriceWithCommas(property.price)}k</Text>, which is
                            {" "}<Text style={styles.descriptionBold}>{percentagePriceDifference}%</Text>
                            {isHigherThanAverage ? <Text style={styles.lowerText}> <Ionicons name="arrow-down-circle-outline" size={18} color="green" />lower</Text> : <Text style={styles.higherText}> <Ionicons name="arrow-up-circle-outline" size={18} color="#d32f2f" />higher</Text>} than the average asking price of
                            S$<Text style={styles.descriptionBold}>{formatPriceWithCommas(predictedPropertyPriceCurrentDate)}k. </Text> {'\n\n'}
                            This is with reference to the Listed Property's Flat Type, Lease Commence Year, Floor Area and District from
                            past resale transactions from <Text style={styles.descriptionBold}>data.gov.sg</Text>.
                        </Text>
                    </View>
                    {/* <View style={styles.dataContainer}>
                        <Text style={styles.dataText} ><Image source={dataGovSgLogo} style={styles.image} /></Text>
                    </View> */}
                </>
            ) : (
                <>
                    <ActivityIndicator style={styles.loadingIndicator} />
                    {/* <Text styles={styles.loadingText}>Loading...</Text> */}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 20,
        margin: 20,
        paddingTop: 20,
        marginBottom: 30,
        paddingBottom: 265,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        // alignItems: 'center', // Center chart in card
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: -5,
        marginBottom: 20,
        paddingLeft: 12,
    },
    yearText: {
        fontSize: 11,
        // color: 'white',
    },
    loadingText: {
        fontSize: 16,
        paddingVertical: 50,
        color: 'gray',
        textAlign: 'center',
        justifyContent: 'center',
    },
    buyButton: {
        width: "15%",
        position: 'absolute',
        padding: 6,
        paddingHorizontal: 2,
        backgroundColor: '#FFD700', // Yellow color
        alignItems: 'center',
        borderWidth: 1,        // Add border
        borderColor: '#000',   // Border color
        borderRadius: 10,      // Make it rounded
        margin: 2,  // Margin for spacing between buttons
        // marginTop: 30, // Margin for spacing between buttons and bottom of screen
    },
    descriptionText: {
        position: 'absolute',
        paddingVertical: 15,
        paddingHorizontal: 20,
        letterSpacing: 0.75,
        // backgroundColor: '#FFD700', // Yellow color
        alignItems: 'center',
        borderWidth: 0.2,        // Add border
        borderColor: '#000',   // Border color
        borderRadius: 10,      // Make it rounded
        margin: 2,  // Margin for spacing between buttons
        marginTop: 35, // Margin for spacing between buttons and bottom of screen
    },
    dataText: {
        position: 'absolute',
        // paddingVertical: 2,
        paddingHorizontal: 15,
        fontSize: 10,
        letterSpacing: 0.75,
        backgroundColor: '#FFD700',
        // Yellow color
        alignItems: 'center',
        borderWidth: 0.5,        // Add border
        borderColor: '#000',   // Border color
        borderRadius: 10,      // Make it rounded
        // margin: 2,  // Margin for spacing between buttons
        marginTop: 220, // Margin for spacing between buttons and bottom of screen
    },
    dataContainer: {
        borderTopColor: '#eee',
        justifyContent: 'ce', // Added for spacing between buttons
        // paddingTop: 10, // Added for spacing between buttons and top of screen
        paddingHorizontal: 1, // Padding to give space from the screen edge
    },
    descriptionBold: {
        fontWeight: 'bold',
        letterSpacing: 0.75,
    },
    higherText: {
        color: '#d32f2f',
        fontWeight: 'bold',
        letterSpacing: 0.75,
    },
    lowerText: {
        color: 'green',
        fontWeight: 'bold',
        letterSpacing: 0.75,
    },
    bottomButtonsContainer: {
        // flexDirection: 'row',
        borderTopColor: '#eee',
        justifyContent: 'space-between', // Added for spacing between buttons
        // paddingTop: 10, // Added for spacing between buttons and top of screen
        paddingHorizontal: 1, // Padding to give space from the screen edge
    },
    image: {
        // flex: 1,
        // marginLeft: -40,
        // paddingTop: 15,
        // paddingBottom: -15,   
        height: 10,
        width: 60,
        resizeMode: 'contain', // Use 'cover' for better image fitting
    },
    imageContainer: {
        marginBottom: 10, // Adjust this value as needed
        marginLeft: 20, // Adjust this value as needed
    },
    loadingIndicator: {
        flex: 2,
        paddingTop: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PredictionPriceCard;
