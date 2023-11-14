import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { downloadInvoicePDF } from "../../../services/pdfReport";

const TransactionScreen = ({ route }) => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation(); // Use useNavigation to access the navigation object
    const { transaction } = route.params;
    const isSeller = user.user.userId === transaction.userId;
    const showReimbusement = (transaction.transactionType === 'OPTION_FEE' || transaction.transactionType === 'OPTION_EXERCISE_FEE') && isSeller && (transaction.optionFeeStatusEnum === 'COMPLETED' || transaction.optionFeeStatusEnum === 'PAID_OPTION_EXERCISE_FEE' || transaction.optionFeeStatusEnum === 'ADMIN_SIGNED')

    // Function to format date in a readable way
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to format currency
    const formatCurrency = (amount) => {
        return `SGD ${amount.toFixed(2)}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Invoice</Text>
            </View>

            <View style={styles.invoiceHeader}>
                <Text style={[styles.label, { marginLeft: 172 }]}>Invoice No:</Text>
                <Text style={[styles.info, { marginRight: 58 }]}>{transaction.transactionId}</Text>
            </View>


            <View style={styles.invoiceHeader}>
                <Text style={[styles.label, { marginLeft: 160 }]}>Invoice Date:</Text>
                <Text style={[styles.info, { marginRight: 10 }]}>{formatDate(transaction.createdAt)}</Text>
            </View>

            <View style={styles.invoiceContainer}>
                <View style={styles.invoiceItem}>
                    <Text style={styles.label}>Qty</Text>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.label}>Amount</Text>
                </View>
                <View style={styles.descriptionLineContainer}></View>

                {transaction.transactionType === 'OPTION_FEE' ? (
                    <View style={styles.invoiceItem}>
                        <Text style={styles.info}>{transaction.quantity}{" Qty"}</Text>
                        <Text style={styles.info}>{transaction.transactionItem}</Text>
                        <Text style={styles.info}>
                            {transaction.status === 'PENDING'
                                ? formatCurrency(transaction.onHoldBalance)
                                : formatCurrency(transaction.paymentAmount)}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.invoiceItem}>
                        <Text style={styles.info}>{transaction.quantity}{" Qty"}</Text>
                        <Text style={styles.info}>{transaction.transactionItem}</Text>
                        <Text style={styles.info}>{formatCurrency(transaction.paymentAmount === 0 ? transaction.onHoldBalance : transaction.paymentAmount)}</Text>
                    </View>
                )}


                <View style={(styles.invoiceItem)}>
                    {transaction.status === 'PENDING' ? (
                        <>
                            <Text style={styles.info}></Text>
                            <Text style={styles.info}></Text>
                            <Text style={(styles.label)}>On Hold:</Text>
                            <Text style={styles.info}>
                                {formatCurrency(transaction.onHoldBalance)}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.info}></Text>
                            <Text style={styles.info}></Text>
                            <Text style={(styles.label)}>Subtotal:</Text>
                            <Text style={styles.info}>
                                {formatCurrency(transaction.paymentAmount)}
                            </Text>
                        </>
                    )}
                </View>

                {transaction.gst && (
                    <View style={(styles.invoiceItem)}>
                        <Text style={styles.info}></Text>
                        <Text style={styles.info}></Text>
                        <Text style={(styles.label)}>GST (8%):</Text>
                        <Text style={styles.info}>
                            {formatCurrency(transaction.paymentAmount === 0 ? transaction.onHoldBalance * 0.08 : transaction.paymentAmount * 0.08)}
                        </Text>
                    </View>
                )}



                <View style={styles.totalAmountContainer}>
                    {transaction.status === 'PENDING' ? (
                        <>
                            <Text style={styles.label}>Total Amount:</Text>
                            <Text style={styles.info}>
                                {formatCurrency(
                                    transaction.onHoldBalance +
                                    (transaction.gst ?
                                        (transaction.paymentAmount === 0 ? transaction.onHoldBalance * 0.08 : transaction.paymentAmount * 0.08)
                                        : 0)
                                )}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.label}>Total Amount:</Text>
                            <Text style={styles.info}>
                                {formatCurrency(
                                    transaction.paymentAmount +
                                    (transaction.gst ?
                                        (transaction.paymentAmount === 0 ? transaction.onHoldBalance * 0.08 : transaction.paymentAmount * 0.08)
                                        : 0)
                                )}
                            </Text>
                        </>
                    )}
                </View>
                {/* <View style={styles.bankAccountContainer}> */}
                {showReimbusement ? (
                    transaction.reimbursed === true ? (
                        <>
                            <View style={styles.bankAccountInfoContainer}>
                                <Text style={styles.label}>Transferred to Bank Account:</Text>
                            </View>
                            <View style={styles.bankAccountInfoContainer}>
                                <Text style={styles.label}>Bank: </Text>
                                <Text style={styles.info}>{user.user.bankName}</Text>
                            </View>
                            <View style={styles.bankAccountInfoContainer}>
                                <Text style={styles.label}>Bank Account Number: </Text>
                                <Text style={styles.info}>{user.user.bankAccount}</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.bankAccountInfoContainer}>
                                <Text style={styles.label}>Pending Transfer to Bank Account:</Text>
                            </View>
                            <View style={styles.bankAccountInfoContainer}>
                                <Text style={styles.label}>Bank: </Text>
                                <Text style={styles.info}>{user.user.bankName}</Text>
                            </View>
                            <View style={styles.bankAccountInfoContainer}>
                                <Text style={styles.label}>Bank Account Number: </Text>
                                <Text style={styles.info}>{user.user.bankAccount}</Text>
                            </View>
                        </>
                    )
                ) : (
                    <>
                    </>
                )}
                {/* </View> */}
            </View>
            <TouchableOpacity style={[styles.button, styles.buttonClose, { marginTop: 50, width: "60%" }]}
                onPress={() => {
                    downloadInvoicePDF(transaction.transactionId)
                }}>
                <Text style={styles.textStyle}>Download Invoice</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        alignContent: 'center',
        textAlign: 'center',
        // marginLeft: 120,
        marginTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    invoiceContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        padding: 20,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    invoiceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    totalAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
        paddingBottom: 15,
    },
    bankAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        borderTopColor: '#ddd',
        paddingTop: 10,
        paddingBottom: 15,
    },
    bankAccountInfoContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginTop: 10,
        borderTopColor: '#ddd',
        paddingTop: 1,
        paddingBottom: 1,
    },
    descriptionLineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -10,
        marginBottom: 0,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 5,
        paddingBottom: 15,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 13,
    },
    button: {
        marginBottom: 100,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        alignSelf: "center",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default TransactionScreen;
