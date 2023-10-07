import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserById } from '../../utils/api';
import base64 from 'react-native-base64';

const ForumItemHeader = ({ userId, onMoreOptionsPress, editable, onEdit }) => {

    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState(null); // Initialize user as null

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const postUser = await getUserById(userId);
                    setUser(postUser.data);
                    // console.log("userId:", userId)
                    // console.log("user:", postUser.data);

                    let profileImageBase64;
                    if (postUser && postUser.data.profileImage && postUser.data.profileImage.data) {
                        profileImageBase64 = base64.encodeFromByteArray(postUser.data.profileImage.data);
                        setProfileImage(`data:image/jpeg;base64,${profileImageBase64}`);
                        // console.log(profileImageBase64)
                    }

                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }, [userId])
    );

    return (
        <View style={styles.forumItem}>
            <View style={styles.headerContainer}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <View style={styles.profileImagePlaceholder}>
                        <Icon name="user" size={18} color="white" />
                    </View>
                )}
                {user ? ( // Check if user data is available
                    <>
                        <Text style={styles.userName}>{user.userName}</Text>
                        <Text style={styles.age}>
                            {(new Date()).getFullYear() - new Date(user.dateOfBirth).getFullYear()} y
                        </Text>
                    </>
                ) : (
                    // Render a loading state or a default value while waiting for user data
                    <Text>Loading...</Text>
                )}
            </View>
            <View style={styles.rightHeaderContainer}>
                {editable ?
                    <TouchableOpacity onPress={onEdit} style={{ marginRight: 10 }}>
                        <AntDesign name="edit" size={20} color="black" />
                    </TouchableOpacity>
                    :
                    null}
                <TouchableOpacity onPress={onMoreOptionsPress}>
                    <FontAwesome name="ellipsis-h" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({

    forumItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        // marginBottom:5,
        paddingHorizontal: 16,
        borderBottomColor: '#ccc',
        // borderBottomWidth: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        justifyContent: 'flex-end', // Right-align items
    },
    profileImage: {
        width: 25,
        height: 25,
        borderRadius: 20,
    },
    profileImagePlaceholder: {
        width: 25,
        height: 25,
        borderRadius: 20,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 12,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    age: {
        fontSize: 10,
        color: 'gray',

    },
})

export default ForumItemHeader;