import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';

const TokenCard = ({ tokenData, onPressBuy }) => {
  const { tokenName, tokenPrice, tokenAmount } = tokenData;

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.leftSide}>
          <Text style={styles.tokenName}>{tokenName}</Text>
          <Text style={styles.tokenDetails}>{`SGD ${tokenPrice.toFixed(2)}/Token`}</Text>
          <Text style={[styles.tokenDetails, styles.tokenAmountColor]}>{`SGD ${tokenAmount.toFixed(2)}`}</Text>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity onPress={onPressBuy}>
            <Button mode="contained" style={styles.buyButton} labelStyle={styles.buttonLabel}>
              Buy
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 8,
    elevation: 4,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leftSide: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  tokenDetails: {
    fontSize: 14,
    color: 'black',
  },
  tokenAmountColor: {
    color: 'green',
  },
  rightSide: {},
  buyButton: {
    flex: 1,
    padding: 1,
    backgroundColor: '#FFD700', // Yellow color
    alignItems: 'center',
    borderWidth: 0.5,        // Add border
    borderColor: 'grey',   // Border color
    borderRadius: 5,      // Make it rounded
    margin: 2,  // Margin for spacing between buttons
  },
  buttonLabel: {
    color: 'black',
  },
});

export default TokenCard;
