import React, { useMemo } from 'react';
import { View, Image, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';

const ImageSwiper = () => {
  const images = useMemo(
    () => [
      require('../../assets/Home-Image.jpeg'),
      require('../../assets/Buying-Home.jpg'),
      require('../../assets/HDB-Flats-Near-MRT.jpg'),
      // Add more image paths as needed
    ],
    []
  );

  return (
    <View style={styles.swiperContainer}>
      <Swiper showsButtons={false} loop={true} autoplay={true} autoplayTimeout={5}>
        {images.map((image, index) => (
          <View key={index}>
            <Image source={image} style={styles.swiperImage} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  swiperContainer: {
    height: 130, // Set the desired height
    marginLeft: 15, // Add left padding
    marginRight: 15, // Add right padding
    alignSelf: 'center', // Center horizontally
  },
  swiperImage: {
    width: '100%',
    height: '100%', // Adjust the height as needed
  },
});

export default ImageSwiper;