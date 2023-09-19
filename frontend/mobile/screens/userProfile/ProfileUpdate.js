import React, { useState } from 'react';
import { Button, Image, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

function App() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
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

      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg', // Change this based on your image type
        name: 'profile.jpg',
      });

      const uploadResponse = await fetch('http://localhost:3000/user/1/profilePicture', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        Alert.alert('Error', uploadResult.error || 'Image upload failed.');
      }

      console.log(uploadResult);
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

export default App;
