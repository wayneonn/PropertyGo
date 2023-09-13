import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { loginUser } from '../../utils/api';

function LoginScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleLogin = async () => {
    const { success, data, message } = await loginUser(userName, password);

    if (success) {
      showMessage('Login successful');
      setTimeout(() => {
        navigation.navigate('Home Screen', { user: data });
      }, 2000);
    } else {
      showMessage(message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        style={{ padding: 16, marginBottom: 8, borderWidth: 1, borderRadius: 8 }}
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={{ padding: 16, marginBottom: 8, borderWidth: 1, borderRadius: 8 }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {message && (
        <View style={{ position: 'absolute', top: 50, left: 50, backgroundColor: 'lightgray', padding: 10, borderRadius: 5 }}>
          <Text>{message}</Text>
        </View>
      )}
    </View>
  );
}

export default LoginScreen;
