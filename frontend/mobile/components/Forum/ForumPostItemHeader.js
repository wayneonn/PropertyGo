import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome, AntDesign} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

const ForumItemHeader = ({ userId, onMoreOptionsPress, editable, onEdit }) => {

    const [profileImage, setProfileImage] = useState(null);
    const [user, setUser] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            let profileImageBase64;
            if (user && user.profileImage && user.profileImage.data) {
                profileImageBase64 = base64.encodeFromByteArray(user.profileImage.data);
                setProfileImage(`data:image/jpeg;base64,${profileImageBase64}`);
            }

        }, [])
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
                {user.length > 0 ? (
                    <>
                        <Text style={styles.userName}>{user.userName}</Text>
                        <Text style={styles.age}>
                            {(new Date()).getFullYear() - new Date(user.dateOfBirth).getFullYear()} y
                        </Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.userName}>UserName</Text>
                        <Text style={styles.age}>21y</Text>
                    </>
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