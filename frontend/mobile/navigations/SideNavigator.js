import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
// import { Ionicons } from '@expo/vector-icons';
import LogoutButton from '../components/LogoutButton';
import Appointments from '../screens/sideNavigatorBar/Appointments'
import Documents from '../screens/sideNavigatorBar/Documents'
import ExploreServicesStackGroup from './ExploreServicesStackGroup'; 
import FAQ from '../screens/sideNavigatorBar/FAQs'
import MortgageCalculator from '../screens/sideNavigatorBar/MortgageCalculator'
import Transactions from '../screens/sideNavigatorBar/Transactions'
import UserListings from '../screens/sideNavigatorBar/UserListings'
import WorkWithUs from '../screens/sideNavigatorBar/WorkWithUs'
import ContactUsStackGroup from './ContactUsStackGroup';
import TopBar from '../components/Common/TopNavBar';
import UserProfileStackGroup from './UserProfileStackGroup';
import UserBottomNavigator from './UserBottomNavigator';
import { createDrawerScreen } from '../components/DrawerScreen';
import { AuthContext } from '../AuthContext'; // Import your AuthContext
import base64 from 'react-native-base64';

const CustomDrawerContent = (props) => {
    const { navigation, user, updateUserProfilePicture } = props;
    const { logout } = useContext(AuthContext);

    let profileImageBase64;
    if (user && user.user.profileImage && user.user.profileImage.data) {
        profileImageBase64 = base64.encodeFromByteArray(user.user.profileImage.data);
    }

    const handleLogout = () => {
        logout();
        navigation.navigate("Login Portal");
    };

    const [profileImage, setProfileImage] = useState(null);
    

    useEffect(() => {
        if (profileImageBase64) {
            setProfileImage(`data:image/jpeg;base64,${profileImageBase64}`);
        } else {
            setProfileImage(require('../assets/Default-Profile-Picture-Icon.png'));
        }

        setName(user && user.user.name ? user.user.name : '');
    }, [user]);

    const [name, setName] = useState(user && user.user.name ? user.user.name : '');

    return (
        <DrawerContentScrollView {...props}>
            <View style={{ alignItems: 'center', padding: 16 }}>
                {user && user.user.profileImage ? (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${profileImageBase64}` }}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                ) : (
                    <Image
                        source={require('../assets/Default-Profile-Picture-Icon.png')}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                )}
                <Text style={{ marginTop: 15, fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                    PropertyGo
                </Text>
                {user && user.user.name && (
                    <Text style={{ marginTop: 5, fontSize: 16 }}>
                        Welcome, {name}
                    </Text>
                )}
            </View>

            <DrawerItemList {...props} />

            <LogoutButton onPress={handleLogout} />
        </DrawerContentScrollView>
    );
};

const Drawer = createDrawerNavigator();

const drawerScreens = [
    createDrawerScreen('User Bottom Navigator', UserBottomNavigator, 'home', 'Home'),
    createDrawerScreen('Explore Services Stack Group', ExploreServicesStackGroup, 'search', 'Explore Services'),
    createDrawerScreen('User Profile', UserProfileStackGroup, 'person', 'User Profile'),
    createDrawerScreen('User Listings', UserListings, 'list', 'User Listings'),
    createDrawerScreen('Appointments', Appointments, 'calendar', 'Appointments'),
    createDrawerScreen('Documents', Documents, 'document', 'Documents'),
    createDrawerScreen('Transactions', Transactions, 'swap-horizontal', 'Transactions'),
    createDrawerScreen('Mortgage Calculator', MortgageCalculator, 'calculator', 'Mortgage Calculator'),
    createDrawerScreen('FAQ', FAQ, 'help-circle', 'FAQ'),
    createDrawerScreen('Contact Us Group', ContactUsStackGroup, 'mail', 'Contact Us'),
    createDrawerScreen('Work With Us', WorkWithUs, 'briefcase', 'Work With Us'),
];

const SideBar = ({ route }) => {
    const { user } = useContext(AuthContext);
    
    let profileImageBase64;
    if (user && user.user.profileImage && user.user.profileImage.data) {
        profileImageBase64 = base64.encodeFromByteArray(user.user.profileImage.data);
    }

    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState(user && user.user.name ? user.user.name : '');

    useEffect(() => {
        if (user && user.user.profileImage) {
            setProfileImage(`data:image/jpeg;base64,${profileImageBase64}`);
        } else {
            setProfileImage(require('../assets/Default-Profile-Picture-Icon.png'));
        }

        setName(user && user.user.name ? user.user.name : '');
    }, [user]);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
            screenOptions={() => ({
                drawerActiveTintColor: "#FFD700",
                header: () => <TopBar/>,
                // headerShown: false,
            })}>
            {drawerScreens.map((screen) => (
                <Drawer.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={screen.options}
                    initialParams={{ parentRoute: route }}
                />
            ))}
        </Drawer.Navigator>
    );
};

export default SideBar;
