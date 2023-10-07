import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PieChart from 'react-native-pie-chart';
import {calculateMortgageData} from '../../services/CalculateMortgageData';
import {Legend} from '../../components/Legend';


const MortgageCalculator = ({navigation}) => {
    const [loanAmount, setLoanAmount] = useState('');
    const [loanInterestRate, setLoanInterestRate] = useState('');
    const [loanTenureYears, setLoanTenureYears] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [principalPayment, setPrincipalPayment] = useState(0);
    const [interestRepayment, setInterestRepayment] = useState(0);
    const [legendData, setLegendData] = useState([]);

    useFocusEffect(React.useCallback(() => {
        setLoanAmount('');
        setLoanInterestRate('');
        setLoanTenureYears('');
        setMonthlyPayment(0);
        setPrincipalPayment(0);
        setInterestRepayment(0);
        setLegendData([]);
    }, []));

    const calculateMortgage = () => {


        if (loanAmount <= 0 || loanInterestRate <= 0 || loanTenureYears <= 0) {
            Alert.alert('Invalid Input', 'Please enter valid values for Loan Amount, Interest Rate, and Loan Tenure.');
            return;
        }

        const numericPattern = /^\d*\.?\d*$/;
        if (
            !numericPattern.test(loanAmount) ||
            !numericPattern.test(loanInterestRate) ||
            !numericPattern.test(loanTenureYears)
        ) {
            Alert.alert(
                'Invalid Input',
                'Please enter valid numeric values for Loan Amount, Interest Rate, and Loan Tenure.'
            );
            return;
        }

        // Check if Loan Tenure is greater than 35
        if (parseFloat(loanTenureYears) > 35) {
            Alert.alert('Invalid Loan Tenure', 'Loan Tenure cannot exceed 35 years.');
            return;
        }

        const tenureMonths = parseFloat(loanTenureYears) * 12; // Convert to months
        const {monthlyRepayment, interestRepayment} = calculateMortgageData(
            parseFloat(loanAmount),
            parseFloat(loanInterestRate),
            tenureMonths
        );

        setMonthlyPayment(monthlyRepayment);
        setInterestRepayment(interestRepayment);
        setPrincipalPayment(monthlyRepayment - interestRepayment);
        // console.log(monthlyPayment)

        setLegendData([
            {
                label: 'Principal Payment',
                color: '#FFD700',
                amount: monthlyRepayment - interestRepayment,
            },
            {
                label: 'Interest Repayment',
                color: 'black',
                amount: interestRepayment,
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.formContainer}>
                <Text style={styles.header}>Mortgage Calculator</Text>

                <View style={styles.pieChartContainer}>
                    <Text style={styles.result}>Monthly Payment: ${monthlyPayment.toFixed(2)}</Text>
                    {principalPayment > 0 && interestRepayment > 0 ? (
                        <View style={styles.pieChartContainer}>
                            <PieChart
                                widthAndHeight={150}
                                series={[principalPayment, interestRepayment]}
                                sliceColor={['#FFD700', 'black']}
                                doughnut={true}
                                coverRadius={0.6}
                                coverFill={'#FFFF'}
                                style={{margin: 5}}
                            />
                            <Legend data={legendData}/>
                        </View>

                    ) : (
                        <Text>No data to display.</Text>
                    )}
                </View>

                <Text style={styles.label}>Loan Amount:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Loan Amount"
                    onChangeText={(text) => setLoanAmount(text.toString())}
                    keyboardType="numeric"
                    value={loanAmount}
                />

                <Text style={styles.label}>Interest Rate:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Interest Rate"
                    onChangeText={(text) => setLoanInterestRate(text.toString())}
                    keyboardType="numeric"
                    value={loanInterestRate}
                />

                <Text style={styles.label}>Loan Tenure (Years):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Loan Tenure (Years)"
                    onChangeText={(text) => setLoanTenureYears(text.toString())}
                    keyboardType="numeric"
                    value={loanTenureYears}
                    maxLength={2}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={calculateMortgage}
                    underlayColor="#FFC94E"
                >
                    <Text style={styles.buttonText}>Calculate Mortgage</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    pieChartContainer: {
        alignItems: 'center',
        // borderWidth:1,
    },
    result: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FFD700',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    label: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default MortgageCalculator;
