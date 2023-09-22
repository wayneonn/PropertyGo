import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export const createDrawerScreen = (name, component, iconName, label, hideHeader = false) => {
    return {
        name,
        component,
        options: () => ({
            drawerLabel: label,
            drawerIcon: ({ focused, color, size }) => (
                label === "Forum" ? <MaterialCommunityIcons
                name={focused ? iconName : `${iconName}-outline`}
                    size={size}
                    color={color}
                    />
                :<Ionicons
                    name={focused ? iconName : `${iconName}-outline`}
                    size={size}
                    color={color}
                />
            ),
            // headerShown: !hideHeader && route.name !== 'Home', // Show header unless it's the "Home" screen
            // headerShown: false,
        }),
    };
};