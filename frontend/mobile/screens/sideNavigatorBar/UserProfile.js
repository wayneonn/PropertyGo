import React, {useContext} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AuthContext} from '../../AuthContext';
import base64 from 'react-native-base64';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library

function UserProfile({navigation}) {
    const {user, logout} = useContext(AuthContext);
    console.log('loggedInUser:', user);

    let profileImageBase64;
    if (user && user.user.profileImage && user.user.profileImage.data) {
        profileImageBase64 = base64.encodeFromByteArray(user.user.profileImage.data);
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Please log in to view your profile.</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>User Profile</Text>
                <View style={styles.profileHeader}>
                    {profileImageBase64 ? (
                        <Image
                            source={{uri: `data:image/jpeg;base64,${profileImageBase64}`}}
                            style={styles.profileImage}
                        />
                    ) : (
                        <Image
                            source={require('../../assets/Default-Profile-Picture-Icon.png')} // Provide a default image source
                            style={{width: 150, height: 150, borderRadius: 120}}
                        />
                    )}
                    <Text style={styles.heading}>Profile Picture</Text>
                </View>
                <View style={styles.profileInfo}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{user.user.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{user.user.email}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Country:</Text>
                        <Text style={styles.value}>{user.user.countryOfOrigin}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Date Of Birth:</Text>
                        <Text style={styles.value}>{user.user.dateOfBirth}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editProfileButton}
                    onPress={() => {
                        navigation.navigate('EditProfile'); //Change this to the correct screen name
                    }}
                >
                    <Icon
                        name="edit"
                        size={20}
                        color="white"
                        style={styles.editIcon}
                    />
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    userIcon: {
        marginBottom: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 120,
    },
    defaultProfileImage: {
        width: 150,
        height: 150,
        borderRadius: 120,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultProfileText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    profileInfo: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Align items to the left
        marginBottom: 8,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    value: {
        fontSize: 18,
        marginBottom: 16,
    },
    editProfileButton: {
        backgroundColor: 'dodgerblue',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center', // Center horizontally
        flexDirection: 'row',
        justifyContent: 'center', // Center vertically
        width: '60%',
        marginLeft: 0,
    },
    editIcon: {
        marginRight: 10,
    },
    editProfileButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    loginLink: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 8,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        marginTop: -50,
        marginBottom: 50,
    },
});

export default UserProfile;
