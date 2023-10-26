import {PieChart} from "react-native-chart-kit";
import {Animated, Dimensions, Text} from "react-native";
import React, {useEffect, useRef} from "react";

export const MyPieChart = ({transactionCountryCount}) => {

    const slideAnim = useRef(new Animated.Value(0)).current;  // Initial position off-screen
    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 70,
            tension: 5,
            friction: 3,
            useNativeDriver: false
        }).start();
    }, []);


    function transformToPieChartData() {
        return transactionCountryCount.map(buyer => ({
            name: buyer.countryOfOrigin,
            population: buyer.transactionCount,
            color: getColorForCountry(buyer.countryOfOrigin), // function to get color based on country
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        }));
    }


    function getColorForCountry(country) {
        // You can have a predefined map of colors or generate colors dynamically.
        const colorMap = {
            'SINGAPORE': 'rgba(131, 167, 234, 1)',
            'MALAYSIA': '#F00',
            // ... other countries and colors
        };

        return colorMap[country] || '#000'; // Default color if country is not in map
    }

    const data_pie = transformToPieChartData()


    const result = [...data_pie].reduce((acc, curr, index) => {
        if (curr.population > acc.maxValue) {
            return { maxValue: curr.population, maxName: curr.name };
        } else {
            return acc;
        }
    }, { maxValue: Number.MIN_SAFE_INTEGER, maxName: "" });

    return (
        <>
            <PieChart
                data={data_pie}
                width={Dimensions.get('window').width - 30}
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
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'10'}
                center={[10, 10]}
                absolute
            />

            <Animated.View style={{
                height: slideAnim,
                padding: 10,
                backgroundColor: '#ffa726',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                    Most of your customers are from {<Text style={{fontWeight: "bold"}}>{result.maxName}</Text>}, you should market more there.
                </Text>
            </Animated.View>
        </>
    );
};
