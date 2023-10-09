import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const ForumModal = ({ itemType, isVisible, onClose, onReport, onDelete, flagged }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          {onDelete ?
            <TouchableOpacity style={styles.modalOption} onPress={onDelete}>
              <Text>Delete {itemType}</Text>
            </TouchableOpacity>
            : flagged ?
              <TouchableOpacity style={styles.modalOption} onPress={onReport}>
                <Text>Unflag {itemType}</Text>
              </TouchableOpacity> :
              <TouchableOpacity style={styles.modalOption} onPress={onReport}>
                <Text>Flag {itemType}</Text>
              </TouchableOpacity>
          }
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

export default ForumModal;