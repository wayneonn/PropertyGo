import {useEffect, useState} from "react";
import {Button, Image, StyleSheet, Text, View} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function Test() {
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "975614309732-0ngvqr4vvcebrjdlpeldknq9mpr3a5mq.apps.googleusercontent.com",
        iosClientId: "975614309732-aef963hu3lkfus4u3jqnnkmm263vb7v7.apps.googleusercontent.com",
        expoClientId: "975614309732-7efv821237vv7prh9oq73vek4bv2h4il.apps.googleusercontent.com",
    });

    useEffect(() => {
        handleEffect();
    }, [response, token]);

    async function handleEffect() {
        const user = await getLocalUser();
        console.log("user", user);
        if (!user) {
            if (response?.type === "success") {
                // setToken(response.authentication.accessToken);
                getUserInfo(response.authentication.accessToken);
            }
        } else {
            setUserInfo(user);
            console.log("loaded locally");
        }
    }

    const getLocalUser = async () => {
        const data = await AsyncStorage.getItem("@user");
        if (!data) return null;
        return JSON.parse(data);
    };

    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            const user = await response.json();
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            setUserInfo(user);
        } catch (error) {
            // Add your own error handler here
        }
    };

    return (
        <View style={styles.container}>
            {!userInfo ? (
                <Button
                    title="Sign in with Google"
                    disabled={!request}
                    onPress={() => {
                        promptAsync();
                    }}
                />
            ) : (
                <View style={styles.card}>
                    {userInfo?.picture && (
                        <Image source={{uri: userInfo?.picture}} style={styles.image}/>
                    )}
                    <Text style={styles.text}>Email: {userInfo.email}</Text>
                    <Text style={styles.text}>
                        Verified: {userInfo.verified_email ? "yes" : "no"}
                    </Text>
                    <Text style={styles.text}>Name: {userInfo.name}</Text>
                    {/* <Text style={styles.text}>{JSON.stringify(userInfo, null, 2)}</Text> */}
                </View>
            )}
            <Button
                title="remove local store"
                onPress={async () => await AsyncStorage.removeItem("@user")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    card: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 15,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});
