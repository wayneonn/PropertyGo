import {BarChart} from "react-native-chart-kit";
import {Animated, Dimensions, Text, TouchableOpacity} from "react-native";
import React, {useEffect, useRef, useState} from "react";

export const MyBarChart = ({monthTransactions}) => {
    // Need to read the data from the transactions.
    // I need to use the summary data for each month.
    const labels = monthTransactions.length !== 0 ? monthTransactions.map(item => monthDigitToString(item.month)) : ["Jan", "Feb", "Mar", "Apr", "May", "June"];
    const dataPoints = monthTransactions.length !== 0 ? monthTransactions.map(item => item.transactionCount) : [0, 0, 0, 0, 0, 0];
    const [showRecommendation, setShowRecommendation] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;  // Initial position off-screen
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
            <BarChart
                data={{
                    labels: labels,
                    datasets: [{
                        data: dataPoints,
                    }]
                }}
                width={Dimensions.get('window').width - 16}  // from react-native
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
                    barPercentage: 0.5,
                }}
                showValuesOnTopOfBars
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />

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
                        <Text style={{color: 'white', fontSize: 16}}>
                            Your transactions this month are lower than last month. Consider buying a boost!
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            ) : (
                <Animated.View style={{
                    height: slideAnim,
                    padding: 10,
                    backgroundColor: '#ffa726',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{color: 'white', fontSize: 16}}>
                        Amazing, you have as much as or more transactions then the last month! Good job!
                    </Text>
                </Animated.View>
            )}
        </>
    );
};