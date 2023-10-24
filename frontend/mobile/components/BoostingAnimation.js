import * as Animatable from "react-native-animatable";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";

export const BoostingAnimation = () => {
    const [currentColor, setCurrentColor] = useState('blue'); // Initial color
    const colors = ['red', 'green', 'blue', 'orange']; // Define your desired colors
    const animationDuration = 1000; // Duration for each color change (in milliseconds)

    useEffect(() => {
        // Create a timer to change the color at regular intervals
        const colorChangeTimer = setInterval(() => {
            // Get the next color in the array
            const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
            const nextColor = colors[nextColorIndex];
            setCurrentColor(nextColor);
        }, animationDuration);

        // Clear the timer when the component unmounts
        return () => clearInterval(colorChangeTimer);
    }, [currentColor]);

    return (
        <Animatable.View animation="jello" easing="ease-out" iterationCount="infinite">
            <Ionicons
                name="flash"
                size={24}
                color={currentColor}
                style={{marginRight: 4}}
            />
        </Animatable.View>
    )
}
