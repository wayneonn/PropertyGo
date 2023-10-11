import React from 'react';
import { View, Text } from 'react-native';

const TextComponent = ({ content }) => {
    return (
        <View>
            <Text>
                <span dangerouslySetInnerHTML={{ __html: content }}></span>
            </Text>
        </View>
    );
};

export default TextComponent;
