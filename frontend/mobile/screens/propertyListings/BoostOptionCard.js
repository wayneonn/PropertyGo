import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';

const BoostOptionCard = ({ boostOption, onPressBoost }) => {
  const { days, tokens } = boostOption;

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.leftSide}>
          <Text style={styles.boostDays}>{`${days} Days`}</Text>
          <Text style={styles.tokenDetails}>{`${tokens} Tokens`}</Text>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity onPress={() => onPressBoost(days, tokens)}>
            <Button mode="contained" style={styles.boostButton} labelStyle={styles.buttonLabel}>
              Boost
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
  },
  boostDays: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tokenDetails: {
    fontSize: 16,
    color: 'gray',
  },
  boostButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BoostOptionCard;
