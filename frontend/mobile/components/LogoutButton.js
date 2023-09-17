import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LogoutButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        }}
      >
        <Ionicons name="exit-outline" size={24} color="#000" style={{ marginRight: 16 }} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Logout</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LogoutButton;
