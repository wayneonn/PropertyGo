import React, { useState } from 'react';
import { View, Text, StyleSheet} from 'react-native';


export const Legend = ({ data }) => (
    <View style={styles.legendContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View
            style={{
              backgroundColor: item.color,
              width: 20,
              height: 20,
              marginRight: 5,
            }}
          />
          <Text>{item.label + ": "+ item.amount.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
  
  const styles = StyleSheet.create({
    legendContainer: {
      flexDirection: 'column',
    //   alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      marginTop: 10,
    },
  });
''  