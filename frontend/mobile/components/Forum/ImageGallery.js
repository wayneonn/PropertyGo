import React, { useState } from 'react';
import { View, Image, FlatList, TouchableOpacity } from 'react-native';
import ImageView from 'react-native-image-viewing';
import base64 from 'react-native-base64';

const ImageGallery = ({ images }) => {
  const [visible, setVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const openImageViewer = (index) => {
    setInitialIndex(index);
    setVisible(true);
  };

  const renderItem = ({ item, index }) => {
    // Convert the binary image data to a base64-encoded string
    const base64String = base64.encodeFromByteArray(item.image.data);
    // console.log(base64String);

    return (
      <TouchableOpacity onPress={() => openImageViewer(index)}>
        <Image
          source={{
            uri: `data:image/jpeg;base64,${base64String}`,
          }}
          style={{ width: 150, height: 150, marginHorizontal:3 }} // You can adjust the dimensions here
          // Add error handling if needed
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{marginHorizontal:15, marginTop:10}}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.imageId.toString()}
        renderItem={renderItem}
        horizontal={true}
      />
      <ImageView
        images={images.map((item) => ({
          uri: `data:image/jpeg;base64,${base64.encodeFromByteArray(item.image.data)}`,
        }))}
        imageIndex={initialIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
};

export default ImageGallery;
