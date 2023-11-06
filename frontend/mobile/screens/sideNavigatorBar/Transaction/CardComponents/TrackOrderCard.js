import React from 'react';
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

const TrackOrderCard = ({ optionFeeStatus, optionFee, transactionId, transactionDate }) => {

    const labels = ["Payment Made", "Seller Uploaded OTP", "Buyer Uploaded OTP", "Awaiting Admin To Sign As Witness", "Ready To Proceed To Exercise Purchase!"];
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
        } else if (status === 'COMPLETED') {
            return 5;
        }
    }

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

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(property.propertyId)}>
            <View style={styles.propertyDetails}>
                <View style={styles.orderTitleContainer}>
                    <Text style={styles.orderStatus}>Track Order</Text>
                    {typeof optionFee === 'number' && (
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountLabel}>Amt:</Text>
                            <Text style={styles.amountValue}>${optionFee.toFixed(2)}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.transactionId}>Transaction ID - {transactionId}</Text>
                <Text style={styles.transactionDate}>{formattedDateString}</Text>
                <StepIndicator
                    customStyles={stepIndicatorStyles}
                    stepCount={5}
                    direction="vertical"
                    currentPosition={statusStage(optionFeeStatus)}
                    labels={labels}
                />
            
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
        aspectRatio: 1,
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
});

export default TrackOrderCard;
