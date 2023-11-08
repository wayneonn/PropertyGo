import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUriById, addFavoriteProperty, removeFavoriteProperty, isPropertyInFavorites } from '../../../../utils/api';
import { AuthContext } from '../../../../AuthContext';
import DefaultImage from '../../../../assets/No-Image-Available-Small.jpg';
import StepIndicator from 'react-native-step-indicator';

const TrackOrderCard = ({ optionFeeStatus, paymentAmount, onHoldBalance, transactionId, transactionDate, transactionUserId }) => {
    const { user } = useContext(AuthContext);
    const isSeller = (user.user.userId === transactionUserId)
    const labels = ["Request Placed", "Seller Uploaded OTP", "Buyer Uploaded OTP", "Awaiting Admin To Sign As Witness", "Ready To Proceed To Exercise Purchase!"];
    const stepIndicatorStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: 'dodgerblue',
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: 'dodgerblue',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: 'dodgerblue',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: 'dodgerblue',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: '#000',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#000',
        labelSize: 12,
        labelAlign: 'left',
        currentStepLabelColor: '#000'
    }

    const statusStage = (status) => {
        if (status === 'REQUEST_PLACED') {
            return 1;
        } else if (status === 'SELLER_UPLOADED') {
            return 2;
        } else if (status === 'BUYER_UPLOADED') {
            return 3;
        } else if (status === 'ADMIN_UPLOADED') {
            return 4;
        } else if (status === 'COMPLETED' || status === 'ADMIN_SIGNED' || status === 'PAID_OPTION_EXERCISE_FEE') {
            return 5;
        }
    }

    // Function to get the color based on status
    const getStatusColor = (status) => {
        if (isSeller) {
            switch (status) {
                case 'REQUEST_PLACED':
                case 'BUYER_REQUEST_REUPLOAD':
                    return 'yellow';
                case 'BUYER_UPLOADED':
                case 'SELLER_UPLOADED':
                case 'ADMIN_UPLOADED':
                    return 'orange';
                case 'COMPLETED':
                case 'ADMIN_SIGNED':
                case 'PAID_OPTION_EXERCISE_FEE':
                    return 'green';
                case 'SELLER_DID_NOT_RESPOND':
                case 'BUYER_CANCELLED':
                case 'SELLER_CANCELLED':
                case 'ADMIN_REJECTED':
                    return 'red';
                default:
                    return 'blue'; // Default color
            }
        } else {
            switch (status) {
                case 'REQUEST_PLACED':
                case 'BUYER_UPLOADED':
                case 'BUYER_REQUEST_REUPLOAD':
                case 'ADMIN_UPLOADED':
                    return 'orange';
                case 'SELLER_UPLOADED':
                    return 'yellow';
                case 'COMPLETED':
                case 'ADMIN_SIGNED':
                case 'PAID_OPTION_EXERCISE_FEE':
                    return 'green';
                case 'SELLER_DID_NOT_RESPOND':
                case 'BUYER_CANCELLED':
                case 'SELLER_CANCELLED':
                case 'ADMIN_REJECTED':
                    return 'red';
                default:
                    return 'blue'; // Default color
            }
        }
    };

    // Function to get the status text based on status
    const getStatusText = (status) => {
        if (isSeller) {
            switch (status) {
                case 'REQUEST_PLACED':
                    return '⚠️ Pending Your Response To Upload';
                case 'BUYER_UPLOADED':
                    return '⏳ Awaiting Admin Response To Upload';
                case 'SELLER_UPLOADED':
                    return '⏳ Awaiting Buyer Response To Upload';
                case 'ADMIN_UPLOADED':
                    return 'Admin Has Uploaded';
                case 'ADMIN_SIGNED':
                case 'COMPLETED':
                    return 'Completed';
                case 'SELLER_DID_NOT_RESPOND':
                    return 'Seller Did Not Respond';
                case 'BUYER_CANCELLED':
                    return 'Buyer Cancelled The Request';
                case 'SELLER_CANCELLED':
                    return 'You Cancelled The Request';
                case 'BUYER_REQUEST_REUPLOAD':
                    return '⚠️ Pending Your Response To Reupload';
                case 'ADMIN_REJECTED':
                    return 'Admin Rejected The Document';
                case 'PAID_OPTION_EXERCISE_FEE':
                    return 'Paid Option Exercise Fee';
                default:
                    return status; // Default status text
            }
        } else {
            switch (status) {
                case 'REQUEST_PLACED':
                    return '⏳ Awaiting Seller Response To Upload';
                case 'BUYER_UPLOADED':
                    return '⏳ Awaiting Admin Response To Upload';
                case 'SELLER_UPLOADED':
                    return '⚠️ Pending Your Response To Upload';
                case 'ADMIN_UPLOADED':
                    return 'Admin Uploaded OTP';
                case 'ADMIN_SIGNED':
                case 'COMPLETED':
                    return 'Confirmed';
                case 'SELLER_DID_NOT_RESPOND':
                    return 'Seller Did Not Respond';
                case 'BUYER_CANCELLED':
                    return 'You Cancelled The Request';
                case 'SELLER_CANCELLED':
                    return 'Seller Cancelled The Request';
                case 'BUYER_REQUEST_REUPLOAD':
                    return 'Buyer Requested Reupload';
                case 'ADMIN_REJECTED':
                    return 'Admin Rejected The Document';
                case 'PAID_OPTION_EXERCISE_FEE':
                    return 'Paid Option Exercise Fee';
                default:
                    return status; // Default status text
            }
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'SELLER_DID_NOT_RESPOND':
            case 'BUYER_CANCELLED':
            case 'SELLER_CANCELLED':
            case 'ADMIN_REJECTED':
            case 'ADMIN_SIGNED':
            case 'COMPLETED':
            case 'PAID_OPTION_EXERCISE_FEE':
                return 'white';
            default:
                return 'black'; // Default color
        }
    };

    // Format the transactionDate
    const formattedDate = new Date(transactionDate);
    const formattedDateString = formattedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const formatPrice = (price) => {
        if (price !== null && !isNaN(price)) {
          const formattedPrice = price.toFixed(2); // Format to 2 decimal places
          return formattedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          return 'N/A'; // Handle the case when price is null, undefined, or not a number
        }
      };

    return (
        <TouchableOpacity style={styles.card} onPress={() => console.log("pressed!")}>
            <View style={styles.propertyDetails}>
                <View style={styles.orderTitleContainer}>
                    <Text style={styles.orderStatus}>Track Order</Text>
                    {/* {typeof onHoldBalance === 'number' && ( */}
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountLabel}>Amt:</Text>
                            <Text style={styles.amountValue}>${formatPrice(
                                onHoldBalance === 0 ?
                                    paymentAmount : onHoldBalance
                            )}</Text>
                        </View>
                    {/* )} */}
                </View>
                <Text style={styles.transactionId}>Transaction ID - {transactionId}</Text>
                <Text style={styles.transactionDate}>{formattedDateString}</Text>
                {/* <View style={styles.stepIndicatorView}> */}
                <StepIndicator
                    customStyles={stepIndicatorStyles}
                    stepCount={5}
                    direction="vertical"
                    currentPosition={statusStage(optionFeeStatus)}
                    labels={labels}
                />
                {/* </View> */}
                <Text></Text>
                <Text></Text>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(optionFeeStatus) }]}>
                    <Text style={[styles.statusText, { color: getStatusTextColor(optionFeeStatus) }]}>{getStatusText(optionFeeStatus)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 10,
        padding: 15,
        width: '94%',
        aspectRatio: 0.8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    orderTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderStatus: {
        fontSize: 18,
        marginTop: 5,
        fontWeight: 'bold',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // textAlign: 'right',
        marginRight: -70,
    },
    amountLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000', // Black color for the label
        marginRight: 5,
    },
    amountValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'dodgerblue', // Blue color for the amount
    },
    transactionId: {
        color: '#888',
        marginTop: 10,
    },
    transactionDate: {
        color: '#888',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 1,
        left: -5,
        borderWidth: 0.18,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: 'yellow', // Default color
    },
    statusText: {
        fontSize: 10,
        letterSpacing: 1,
        fontWeight: 'bold',
        color: '#000',
        padding: 2,
    },
    stepIndicatorView: {
        marginBottom: 1,
    }
});

export default TrackOrderCard;
