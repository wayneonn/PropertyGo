import React, { useState } from 'react';
import { Button, Image, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfilePicture } from '../../utils/api'; // Assuming api.js is in the same directory

function ProfileUpdate() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadImage = async () => {
    try {
      if (!imageUri) {
        Alert.alert('Error', 'No image selected.');
        return;
      }

      // Use the function from api.js to upload the image
      const response = await updateUserProfilePicture('1', imageUri);

      if (response.success) {
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        Alert.alert('Error', response.message || 'Image upload failed.');
      }

      console.log(response);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Image upload failed.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {imageUri && <Button title="Upload image" onPress={uploadImage} />}
    </View>
  );
}

export default ProfileUpdate;
