import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const FullScreenImage = ({ imageUrl, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={!!imageUrl} // Show the modal when imageUrl is provided
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close-circle" size={30} color="black" />
                </TouchableOpacity>
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1, // Place it above the image
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default FullScreenImage;
