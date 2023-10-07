import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 1, // or adjust the thickness as you like
        backgroundColor: 'black',
        width: '100%',
    },
});

export default Divider;