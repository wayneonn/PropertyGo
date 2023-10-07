import React from 'react';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {createDrawerScreen} from '../components/DrawerScreen';
import ForumStackGroup from './ForumStackGroup';
import ForumTopNavBar from '../components/Forum/ForumTopNavBar';

const CustomDrawerContent = (props) => {
    // const { navigation, user, updateUserProfilePicture } = props;
    // const { logout } = useContext(AuthContext);

    // let profileImageBase64;
    // if (user && user.user.profileImage && user.user.profileImage.data) {
    //     profileImageBase64 = base64.encodeFromByteArray(user.user.profileImage.data);
    // }

    // const handleLogout = () => {
    //     logout();
    //     navigation.navigate("Login Portal");
    // };

    // const [profileImage, setProfileImage] = useState(null);


    // useEffect(() => {
    //     if (profileImageBase64) {
    //         setProfileImage(`data:image/jpeg;base64,${profileImageBase64}`);
    //     } else {
    //         setProfileImage(require('../assets/Default-Profile-Picture-Icon.png'));
    //     }

    //     setName(user && user.user.name ? user.user.name : '');
    // }, [user]);

    // const [name, setName] = useState(user && user.user.name ? user.user.name : '');

    return (
        <DrawerContentScrollView {...props}>
            {/* <View style={{ alignItems: 'center', padding: 16 }}>
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
            </View> */}

            <DrawerItemList {...props} />

            {/* <LogoutButton onPress={handleLogout} /> */}
        </DrawerContentScrollView>
    );
};

const drawerScreens = [
    createDrawerScreen('Forum Stack Group', ForumStackGroup, "forum", "Forum"),
    
];

const Drawer = createDrawerNavigator();

const ForumSideNavigator = () => {
    // const { user } = useContext(AuthContext);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={() => ({
                drawerPosition: 'right',
                drawerActiveTintColor: "#FFD700",
                // header: () => <ForumTopNavBar/>,
                headerShown: false,
            })}
            >
            {drawerScreens.map((screen) => (
                <Drawer.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={screen.options}
                />
            ))}
        </Drawer.Navigator>
    );
};

export default ForumSideNavigator;