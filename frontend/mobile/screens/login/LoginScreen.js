import React, {useContext, useState} from 'react';
import {Alert, Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AuthContext} from '../../AuthContext';
import {loginUser} from '../../utils/api';
import {fetchPartnerApplication} from "../../utils/partnerApplicationApi";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library

function LoginScreen({navigation}) {
    const {login} = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage(null);
        }, 500);
    };

    const handleLogin = async () => {
        // Validate username and password
        if (!userName.trim() || !password.trim()) {
            Alert.alert("Input Entry", 'Please enter both username and password.');
            return;
        }

        const {success, data, message} = await loginUser(userName, password);

        if (success) {
            login(data);
            // This has to be conditional on the type of user login in.
            console.log("This is the data: ", data.user.userType)
            const userType = data.user.userType;
            const partnerApp = await fetchPartnerApplication(data.user.userId);
            console.log(partnerApp.partnerApp)
            const approval_status = partnerApp.partnerApp.length !== 0 ? partnerApp.partnerApp[0].approved : true
            if (['LAWYER','CONTRACTOR','PROPERTY AGENT'].includes(userType) && approval_status !== false) {
                console.log("This is a partner.")
                showMessage('Login successful');
                setTimeout(() => {
                    navigation.navigate('Side Navigator (Partner)', {user: data});
                }, 500);
            } else if (approval_status === false) {
                Alert.alert("Your partner application has not been approved. Check your e-mail for approval.")
            } else {
                showMessage('Login successful');
                setTimeout(() => {
                    navigation.navigate('Side Navigator', {user: data});
                }, 500);
            }
        } else {
            Alert.alert("Error", message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image
                    source={require('../../assets/PropertyGo-HighRes-Logo.png')}
                    style={styles.iconImage}
                />
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor="black"
                        value={userName}
                        onChangeText={setUserName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor="black"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Icon
                                name={showPassword ? 'eye-slash' : 'eye'}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Icon name="sign-in" size={20} color="white" style={styles.loginIcon}/>
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
    formContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'black',
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        color: 'black',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        color: 'black',
    },
    eyeIcon: {
        paddingHorizontal: 10,
    },
    loginButton: {
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center', // Center vertically
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#1E90FF',
        marginVertical: 10,
        marginTop: 20,
        marginLeft: 65,
        width: '60%',
    },
    loginIcon: {
        marginRight: 10,
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
        marginBottom: 200,
        marginTop: 300,
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
