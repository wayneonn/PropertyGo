import {LineChart, StackedBarChart} from "react-native-chart-kit";
import {Animated, Dimensions, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";

export const TransactionChart = ({monthTransactions, averageCount, navigation}) => {
    // Need to read the data from the transactions.
    // I need to use the summary data for each month.
    const labels = monthTransactions.length !== 0 ? monthTransactions.map(item => monthDigitToString(item.month)) : ["Jan", "Feb", "Mar", "Apr", "May", "June"];
    const dataPoints = monthTransactions.length !== 0 ? monthTransactions.map(item => item.transactionCount) : [0, 0, 0, 0, 0, 0];
    const countPoints = averageCount.length !== 0 ? averageCount.map(item => item.averageTransactionsPerUser) : [0, 0, 0, 0, 0, 0];
    const combinedArray = dataPoints.map((value, index) => [countPoints[index], value]);
    const [showRecommendation, setShowRecommendation] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;  // Initial position off-screen
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [activeDataPoint, setActiveDataPoint] = useState(null);
    const tooltipWidth = 130; // estimated or maximum width of the tooltip
    const tooltipHeight = 50; // estimated or maximum height of the tooltip

    useEffect(() => {
        let timeoutId;
        if (activeDataPoint) {
            timeoutId = setTimeout(() => {
                setActiveDataPoint(null);
            }, 1000);
        }
        return () => {
            // Clear the timeout if the component is unmounted or if the tooltip is closed manually
            clearTimeout(timeoutId);
        };
    }, [activeDataPoint]);

    const getAdjustedPosition = (x, y) => {
        let adjustedX = x;
        let adjustedY = y;

        if (x + tooltipWidth > screenWidth) {
            adjustedX = screenWidth - tooltipWidth;
        }

        if (y + tooltipHeight > screenHeight) {
            adjustedY = screenHeight - tooltipHeight;
        }

        return { x: adjustedX, y: adjustedY };
    };

    function formatToCurrency(value) {
        return parseFloat(value).toFixed(2);
    }

    function monthDigitToString(monthDigit) {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        // Check if the month digit is valid (between 1 and 12)
        if (monthDigit < 1 || monthDigit > 12) {
            throw new Error("Invalid month digit. It should be between 1 and 12.");
        }
        // Return the month name. Subtract 1 because arrays are 0-indexed.
        return monthNames[monthDigit - 1];
    }

    const lastMonthTransaction = monthTransactions[1];
    const currentMonthTransaction = monthTransactions[0];

    useEffect(() => {
        if (lastMonthTransaction && currentMonthTransaction &&
            lastMonthTransaction.transactionCount > currentMonthTransaction.transactionCount) {
            setShowRecommendation(true);
        } else {
            setShowRecommendation(false);
        }
    }, [monthTransactions]);

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 70,
            tension: 5,
            friction: 3,
            useNativeDriver: false
        }).start();
    }, [showRecommendation]);

    return (
        <>
            <View>
                <LineChart
                    data={{
                        labels: labels,
                        datasets: [{
                            data: dataPoints,
                        },
                            {
                                data: countPoints,
                                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Optional customization for the average line color
                                strokeWidth: 2 // Optional customization for the average line width
                            }]
                    }}
                    width={screenWidth - 16}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2,  // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726'
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    onDataPointClick={({ index, value, dataset, x, y }) => {
                        const adjustedPosition = getAdjustedPosition(x, y);
                        setActiveDataPoint({ index, value, x: adjustedPosition.x, y: adjustedPosition.y });
                    }}
                />
                {activeDataPoint ? (
                    <View style={{ position: 'absolute', left: activeDataPoint.x, top: activeDataPoint.y, backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
                        <Text>Value: {formatToCurrency(activeDataPoint.value)}</Text>
                    </View>
                ): null}

                {showRecommendation ? (
                    <TouchableOpacity onPress={() => navigation.navigate("Boost Listing")}>
                        <Animated.View style={{
                            height: slideAnim,
                            padding: 10,
                            backgroundColor: '#ffa726',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>
                                Your total request this month are {<Text style={{fontWeight:"bold", color:"#942911"}}>lower</Text>} than last month. Consider buying a boost!
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                ): (
                    <Animated.View style={{
                        height: slideAnim,
                        padding: 10,
                        backgroundColor: '#ffa726',
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Nice, you are earning as much as or more then the last month! Keep up the good work!
                        </Text>
                    </Animated.View>
                )}
            </View>
        </>
    );
};