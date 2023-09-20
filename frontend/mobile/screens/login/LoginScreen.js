import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../AuthContext'; // Import the AuthContext from the correct path
import { loginUser } from '../../utils/api';

function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext); // Use the AuthContext to access login function
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
      login(data); // Use the login function from AuthContext to set the user
      showMessage('Login successful');
      setTimeout(() => {
        navigation.navigate('Side Navigator', { user: data });
      }, 500);
    } else {
      showMessage(message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* Icon at the top center */}
        <Image
          source={require('../../assets/PropertyGo-HighRes-Logo.png')} // Replace with the actual path to your image
          style={styles.iconImage}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="black"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="black"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'black',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#1E90FF',
    marginVertical: 10,
  },
  loginButtonText: {
    fontSize: 18,
    color: 'white',
  },
  messageContainer: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    backgroundColor: 'rgba(144, 238, 144, 0.8)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  iconImage: {
    width: 60,
    height: 60,
  },
};


export default LoginScreen;
