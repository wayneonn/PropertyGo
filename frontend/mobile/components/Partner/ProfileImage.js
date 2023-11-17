import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileImage = ({ userDetails, setModalVisible, modalVisible, navigation }) => {
    const handlePress = () => {
        navigation.navigate('View Profile', { userId: userDetails?.userId });
        setModalVisible(!modalVisible)
    };

    const imageSource = userDetails?.profileImage
        ? { uri: `data:image/jpeg;base64,${userDetails.profileImage.data}` }
        : require('../../assets/Default-Profile-Picture-Icon.png');

    return (
        <TouchableOpacity onPress={handlePress}>
            <Image source={imageSource} style={styles.profileImage} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 120,
        alignSelf: "center"
    }
});

export default ProfileImage;
