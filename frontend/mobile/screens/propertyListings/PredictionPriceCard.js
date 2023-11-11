import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const PredictionPriceCard = ({ flatType, town, floorArea, leaseCommenceDate }) => {
    const [prices, setPrices] = useState([]);
    const screenWidth = Dimensions.get('window').width;

    // Function to get the current year and month
    const getCurrentYearAndMonth = () => {
        const date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1 };
    };

    // Function to fetch data
    const fetchData = async (query) => {
        const response = await fetch(`http://localhost:3000/prediction/property-prices?flatType=${encodeURIComponent(flatType)}&town=${encodeURIComponent(town)}&floor_area_sqm=${floorArea}&year=${query.year}&month=${query.month}&lease_commence_date=${leaseCommenceDate}`);
        const data = await response.json();
        return data.predictedPrice;
    };

    // Effect to load data
    useEffect(() => {
        const { year, month } = getCurrentYearAndMonth();
        const startYear = year - 3; // Get the past 3 years
        const endYear = year + 2; // Predict 2 years into the future
        const dataFetchPromises = [];

        for (let y = startYear; y <= endYear; y++) {
            for (let m = 1; m <= 12; m++) {
                if (y === year && m > month) break; // Do not fetch beyond the current month
                dataFetchPromises.push(fetchData({ year: y, month: m }));
            }
        }

        Promise.all(dataFetchPromises).then(fetchedPrices => {
            setPrices(fetchedPrices);
        }).catch(error => {
            console.error('Error fetching prediction data:', error);
        });
    }, [flatType, town, floorArea, leaseCommenceDate]);

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        decimalPlaces: 0,
        propsForDots: {
            r: "0", // Remove dots by setting radius to 0
        },
    };

    // Generate labels for the X-axis
    const labels = [];
    for (let i = 2020; i <= 2025; i++) {
        labels.push(i.toString());
    }

    const data = {
        labels,
        datasets: [
            {
                data: prices,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                strokeWidth: 2
            }
        ]
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Price Prediction</Text>
            {prices.length > 0 ? (
                <LineChart
                    data={data}
                    width={screenWidth - 40} // Take into account padding
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withDots={false} // Do not show dots
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    fromZero={true}
                    // yAxisLabel="Prices"
                    // xAxisLabel="Time"
                />
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center', // Center chart in card
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    chart: {
        borderRadius: 16,
        // alignSelf: 'center' is not needed because of alignItems in the container
    },
});

export default PredictionPriceCard;
