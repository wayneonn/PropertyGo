import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Dimensions, ActivityIndicator, Button,
    TouchableOpacity, Image,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import dataGovSgLogo from '../../assets/data.gov.sg-logo.png';
import { Entypo, FontAwesome5, MaterialCommunityIcons, Ionicons, FontAwesome, } from '@expo/vector-icons';
import { max } from 'date-fns';
import {BASE_URL} from "../../utils/documentApi";

const PredictionPriceCard = ({ flatType, town, floorArea, leaseCommenceDate, property }) => {
    const [prices, setPrices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const screenWidth = Dimensions.get('window').width;
    const [viewMode, setViewMode] = useState('year');
    let monthNow;
    let yearNow;
    const [predictedPropertyPriceCurrentDate, setPredictedPropertyPriceCurrentDate] = useState(0);
    const isHigherThanAverage = predictedPropertyPriceCurrentDate > property.price;
    const percentagePriceDifference = (Math.abs(property.price - predictedPropertyPriceCurrentDate) / property.price * 100.00).toFixed(2);
    const [maxPrice, setMaxPrice] = useState(-Infinity);
    let test = 1020;

    const toggleViewMode = () => {
        setViewMode(viewMode === 'year' ? 'monthYear' : 'year');
    };


    const getCurrentYearAndMonth = () => {
        const date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1 };
    };

    const fetchData = async (query) => {
        const response = await fetch(`${BASE_URL}/prediction/property-prices?flatType=${encodeURIComponent(flatType)}&town=${encodeURIComponent(town)}&floor_area_sqm=${floorArea}&year=${query.year}&month=${query.month}&lease_commence_date=${leaseCommenceDate}`);
        const data = await response.json();
        return data.predictedPrice;
    };

    const formatPriceWithCommas = (price) => {

        let formattedPrice = price * 1000.00;

        formattedPrice = price.toString();
        formattedPrice = parseFloat(formattedPrice).toFixed(1);
        return formattedPrice;
    };

    const formatPriceWithCommasPredictionText = (price) => {

        let formattedPrice = price / 1000.00;

        // formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedPrice = parseFloat(formattedPrice).toFixed(2);
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
        const startYear = year - 1; // Starting 3 years back
        const endYear = year + 3; // Going to 2 years forward
        let currentMonth = month;
        let newMaxPrice = -Infinity;

        const fetchDataForYearAndMonth = async (currentYear, currentMonth) => {
            try {
                const predictedPrice = await fetchData({ year: currentYear, month: currentMonth });
                return { year: currentYear, month: currentMonth, predictedPrice };
            } catch (error) {
                console.error(`Error fetching prediction data for ${currentYear}-${currentMonth}:`, error);
                return null;
            }
        };

        const fetchAllData = async () => {
            const dataFetchPromises = [];
            yearNow = year;
            monthNow = month;
        
            const today = new Date(); // Assuming today is Nov 2023
            let currentYear = startYear; // Start from the current year
            let currentMonth = today.getMonth() + 1; // Start from the current month, adding 1 for 1-based indexing
        
            for (let i = 0; i < 8; i++) {
                dataFetchPromises.push(await fetchDataForYearAndMonth(currentYear, currentMonth));
                
                // Add 6 months to the current month
                currentMonth += 6;
        
                // If the current month is greater than 12, increment the year and adjust the month
                if (currentMonth > 12) {
                    currentYear++;
                    currentMonth -= 12;
                }
        
                console.log('currentYear:', currentYear, 'currentMonth:', currentMonth);
            }
        
            try {
                const fetchedData = await Promise.all(dataFetchPromises);
                const chartData = fetchedData.map((data, index) => {
                    if (data) {
                        const { year, month, predictedPrice } = data;
                        const labelMonth = (currentMonth + index * 6) % 12;
                        const labelYear = startYear + Math.floor((currentMonth + index * 6) / 12);
                        const formattedDate = `${getMonthNameFromNumber(labelMonth)} ${labelYear.toString().slice(-2)}`;

                        const isToday = labelMonth === monthNow && labelYear === yearNow;
                        if (isToday) {
                            setPredictedPropertyPriceCurrentDate(predictedPrice);
                        }

                        if (predictedPrice / 1000 > newMaxPrice) {
                            newMaxPrice = predictedPrice / 1000;
                        }

                        return {
                            value: predictedPrice / 1000,
                            year: formattedDate,
                            labelComponent: () => (
                                isToday ? (
                                    <Text style={styles.todayText}>
                                        {"  "}
                                        <Ionicons name="caret-back-outline" size={14} color="red" />
                                        {"Today"}
                                    </Text>
                                ) : (
                                    <Text style={styles.yearText}>
                                        {"     "}
                                        {getMonthNameFromNumber(labelMonth)} {labelYear.toString().slice(-2)}
                                    </Text>
                                )
                            ),
                        };
                    }
                    return null;
                }).filter(data => data !== null);

                setPrices(chartData);
                const maxPrice = (Math.floor(newMaxPrice / 100) + 3) * 100;
                setMaxPrice(parseInt(maxPrice));
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching prediction data:', error);
            }
        };

        fetchAllData();
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

    const formatYLabel = (label) => {
        // Assuming label is a number (e.g., 1, 2, 3)
        if (label == 0) {
            return 0;
        }
        return `S$ ${label}k`;
      };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PriceGPT</Text>
            {prices.length > 0 && !isLoading && maxPrice !== -Infinity ? (
                <>
                    <View style={styles.containerGraph}>
                        <LineChart
                            isAnimated
                            thickness={5}
                            color="#FFD700"
                            noOfSections={4}
                            animateOnDataChange
                            // hideDataPoints
                            rotateLabel
                            yAxisTextStyle={{ color: 'black', marginLeft: -20, fontSize: 11 }}
                            // yAxisSide='right'
                            animationDuration={1000}
                            formatYLabel={formatYLabel}
                            onDataChangeAnimationDuration={500}
                            areaChart
                            pointerConfig={{
                                pointerStripHeight: 160,
                                pointerStripColor: 'black',
                                pointerStripWidth: 2,
                                pointerColor: 'red',
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
                                                width: 120,
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
                            maxValue={maxPrice}
                            height={200}
                            width={screenWidth - 132}
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
                            yAxisColor="black"
                            xAxisColor="black"
                            renderYAxisLabel={(value) => `S$ ${value}k`}
                            startFromZero={true}
                        />
                    </View>
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
                            S$<Text style={styles.descriptionBold}>{formatPriceWithCommasPredictionText(property.price)}k</Text>, which is
                            {" "}<Text style={styles.descriptionBold}>{percentagePriceDifference}%</Text>
                            {isHigherThanAverage ? <Text style={styles.lowerText}> <Ionicons name="arrow-down-circle-outline" size={18} color="green" />lower</Text> : <Text style={styles.higherText}> <Ionicons name="arrow-up-circle-outline" size={18} color="#d32f2f" />higher</Text>} than the average asking price of
                            S$<Text style={styles.descriptionBold}>{formatPriceWithCommasPredictionText(predictedPropertyPriceCurrentDate)}k. </Text> {'\n\n'}
                            <Text style={styles.footnoteText}>This is with reference to the Listed Property's Flat Type, Lease Commence Year, Floor Area and District from
                                past resale transactions from <Text style={styles.descriptionBold}>data.gov.sg</Text>.</Text>
                        </Text>
                    </View>
                    {/* <View style={styles.dataContainer}>
                        <Text style={styles.dataText} ><Image source={dataGovSgLogo} style={styles.image} /></Text>
                    </View> */}
                </>
            ) : (
                <>
                    <ActivityIndicator style={styles.loadingIndicator} size="large" color="#00adf5" />
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
        paddingBottom: 105,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        height: '29.5%',
        // alignItems: 'center', // Center chart in card
    },
    containerGraph: {
        marginBottom: 50,
        marginLeft: 15,
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
    todayText: {
        fontSize: 12,
        fontWeight: 'bold',
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
        // position: 'absolute',
        paddingVertical: 15,
        paddingHorizontal: 20,
        letterSpacing: 0.75,
        // backgroundColor: '#FFD700', // Yellow color
        alignItems: 'center',
        borderWidth: 0.2,        // Add border
        borderColor: '#000',   // Border color
        borderRadius: 10,      // Make it rounded
        margin: 2,  // Margin for spacing between buttons
        // marginTop: 40, // Margin for spacing between buttons and bottom of screen
    },
    dataText: {
        // position: 'absolute',
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
    footnoteText: {
        fontSize: 11,
        letterSpacing: 0.75,
        fontWeight: '300',
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
