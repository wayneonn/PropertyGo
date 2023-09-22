import React from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';

const Forum = ({navigation}) => {
  return (
    <SafeAreaView >
      <View>
        <Text>Welcome to the Forum!</Text>
        <Button
          title="Go to Forum Side Navigator"
          onPress={() => navigation.navigate('Forum Side Navigator')}
        />
      </View>

    </SafeAreaView>
  );
};

export default Forum;