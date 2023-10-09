import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ImageReloadingComponent = ({ imageUri }) => {
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment the counter to trigger a reload
      setReloadCounter((prevCounter) => prevCounter + 1);
    }, 5000); // Reload every 5 seconds

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        key={reloadCounter} // Key change triggers a re-render and image reload
        source={{ uri: `${imageUri}?timestamp=${new Date().getTime()}` }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default ImageReloadingComponent;
