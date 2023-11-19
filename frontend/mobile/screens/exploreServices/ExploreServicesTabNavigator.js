import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native'; // Import Text and View from react-native
import { useRoute } from '@react-navigation/native';
import ReceiverChat from '../../screens/chat/ReceiverChat';
import SenderChat from '../../screens/chat/SenderChat';
import ContractorServices from "./ContractorServices";
import LawyerServices from "./LawyerServices";
import ImageSwiper from "../../components/ImageSwiper";
const images = [
    require("../../assets/partnerpic-1.png"),
    require("../../assets/partnerpic-2.png"),
    require("../../assets/partnerpic-3.png"),
    require("../../assets/partnerpic-4.png")
]

const Tab = createMaterialTopTabNavigator();

const CustomTabLabel = ({ label, color, icon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <Text style={{ color: "black", marginLeft: 5 }}>{label}</Text>
    </View>
);

const ExploreServicesTabTabNavigator = () => {
    return (
        <>
        {/*<ImageSwiper images_new={images}></ImageSwiper>*/}
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#FFD700',
                tabBarLabelStyle: {
                    color: 'black',
                },
                tabBarItemStyle: {
                    height: 50,
                },
                tabBarIndicatorStyle: {
                    backgroundColor: '#FFD700',
                },
                tabBarStyle: {
                    backgroundColor: 'white',
                },
            }}
        >
            <Tab.Screen
                name="Lawyer Service"
                component={LawyerServices}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Lawyer" color={color} icon="inbox-arrow-up-outline" />
                    ),
                }}
            />
            <Tab.Screen
                name="Contractor Service"
                component={ContractorServices}
                options={{
                    tabBarLabel: ({ color, focused }) => (
                        <CustomTabLabel label="Contractor" color={color} icon="inbox-arrow-down-outline" />
                    ),
                }}
            />
        </Tab.Navigator>
        </>
    );
};

export default ExploreServicesTabTabNavigator;