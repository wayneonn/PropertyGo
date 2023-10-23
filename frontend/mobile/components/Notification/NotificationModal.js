import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const NotificationModal = ({ isVisible, onClose, onFilter }) => {
    return (
        <Modal transparent={true} animationType="slide" visible={isVisible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalOption} onPress={() => onFilter(null)}>
                        <Text>Recent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption} onPress={() => onFilter("isCompleted")}>
                        <Text>Completed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption} onPress={() => onFilter("isPending")}>
                        <Text>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginBottom: 20,
    },
    modalOption: {
        backgroundColor: 'white',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        padding: 16,
    },
    closeButton: {
        backgroundColor: 'white',
        padding: 16,
        textAlign: 'center',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
    },
})

export default NotificationModal;