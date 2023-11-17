import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../../AuthContext';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, RefreshControl, Image, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import ForumPostItem from '../../components/Forum/ForumPostItem';
import { updateForumCommentFlaggedStatus, deleteForumComment, getAllForumComment, createForumComment } from '../../utils/forumCommentApi';
import { updateForumPostFlaggedStatus, deleteForumPost, getAllForumPostById } from '../../utils/forumPostApi';
import ForumCommentItem from '../../components/Forum/ForumCommenItem';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const ForumComment = ({ navigation }) => {

    const { user } = useContext(AuthContext);
    const route = useRoute();
    const [post, setPost] = useState(route.params.post);
    const [comments, setComments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState('');
    const [imageUris, setImageUris] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access camera roll is required!');
            }
        })();
    }, []);

    const useForumPostCallback = useCallback(() => {
        const fetchData = async () => {
            try {
                const forumPost = await getAllForumPostById(post.forumPostId);
                setPost(forumPost);
                // console.log(post)

            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [])

    const useParentCallback = useCallback(() => {
        const fetchData = async () => {
            try {
                const forumComment = await getAllForumComment(user.user.userId, post.forumPostId, "vote", false);
                // console.log(forumComment);
                setComments(forumComment);

            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [])

    useFocusEffect(useParentCallback);

    const handleFlag = async (forumPostId) => {
        await updateForumPostFlaggedStatus(user.user.userId, forumPostId);
        navigation.goBack();
    };

    const handleDelete = async (forumPostId) => {
        try {
            await deleteForumPost(user.user.userId, forumPostId)
            // route.params.callback();
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteComment = async (forumCommentId) => {
        try {
            await deleteForumComment(user.user.userId, forumCommentId);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFlagComment = async (forumCommentId) => {
        try {
            await updateForumCommentFlaggedStatus(user.user.userId, forumCommentId);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }

    };

    const handleRefresh = async () => {
        setRefreshing(true);
        useParentCallback();
        setRefreshing(false);
    };

    const handleImageUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            multiple: true,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            // Check the number of selected images before adding them
            if (imageUris.length + selectedImages.length <= 5) {
                setImageUris([...imageUris, ...selectedImages]);
            }
        }
    };

    const handleImageRemove = (index) => {
        const updatedImageUris = [...imageUris];
        updatedImageUris.splice(index, 1);
        setImageUris(updatedImageUris);

        // Clear the selected image if it was removed
        if (selectedImageIndex === index) {
            setSelectedImageIndex(null);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        // Append each image to the formData
        for (let i = 0; i < imageUris.length; i++) {
            const imageUri = imageUris[i];
            formData.append("images", {
                uri: imageUri,
                type: "image/jpeg",
                name: `image${uniqueId}_${i}.jpg`,
            });
        }


        formData.append('message', message);
        formData.append('forumPostId', post.forumPostId);

        try {
            const forumComment = await createForumComment(user.user.userId, formData);
            useParentCallback();
        } catch (error) {
            console.error(error);
        }

        // Reset the input fields after submission
        setMessage('');
        setImageUris([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={'#FFD700'}
                    />
                }
            >
                <ForumPostItem
                    key={post.forumPostId}
                    userId={user.user.userId}
                    post={post}
                    // onPress={() => handlePostPress(post)}
                    onReport={() => handleFlag(post.forumPostId)}
                    onDelete={() => handleDelete(post.forumPostId)}
                    useParentCallback={useForumPostCallback}
                />
                {comments.map((comment, index) => (
                    <ForumCommentItem
                        key={comment.forumCommentId}
                        userId={user.user.userId}
                        comment={comment}
                        onReport={() => handleFlagComment(comment.forumCommentId)}
                        onDelete={() => handleDeleteComment(comment.forumCommentId)}
                        useParentCallback={useParentCallback}
                    />
                ))}

            </ScrollView>
            <View>
                {imageUris.length !== 0 ? <Text style={styles.warningLabel}>Upload Maximum of 5 Images!</Text> : null}
                <ScrollView horizontal>
                    {imageUris.map((uri, index) => (
                        <View key={index} style={{ margin: 5, position: 'relative' }}>
                            <Image source={{ uri }} style={styles.selectedImage} />
                            <TouchableHighlight
                                style={styles.removeImageButton}
                                onPress={() => handleImageRemove(index)}
                                underlayColor="#EAEAEA"
                            >
                                <AntDesign name="delete" size={24} color="black" />
                            </TouchableHighlight>
                        </View>

                    ))}
                </ScrollView>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                // style={styles.keyboardContainer}
                >
                    <View style={styles.horizontalContainer}>
                        <TextInput
                            placeholder="Type your message here"
                            value={message}
                            onChangeText={text => setMessage(text)}
                            style={styles.textInput}
                            multiline // Allow multiline text input
                        />
                        <TouchableHighlight style={styles.iconButton} onPress={handleImageUpload} underlayColor="rgba(0, 0, 0, 0.1)">
                            <Ionicons name="image-outline" size={30} color="black" />
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.iconButton} onPress={handleSubmit} disabled={!message && imageUris.length === 0} underlayColor="rgba(0, 0, 0, 0.1)">
                            <Ionicons name="send-outline" size={24} color="black" />
                        </TouchableHighlight>
                    </View>
                </KeyboardAvoidingView>
            </View>

        </SafeAreaView >

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10,
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white', // Set background color
        // padding: 10, // Add padding to the container
        borderRadius: 10, // Add border radius for rounded corners
        marginHorizontal: 10,
        borderWidth: 1,
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 10, // Add margin to separate text input from icons
    },
    iconButton: {
        padding: 10,
    },
    selectedImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: 'gray',
    },
    selectedImage: {
        width: 150,
        height: 150,
    },
    removeImageButton: {
        backgroundColor: '#ccc',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        alignItems: 'center',
    },
    warningLabel: {
        fontSize: 12,
        marginHorizontal: 5,
        marginBottom: 5,
        textAlign: 'left',
        alignSelf: 'flex-start',
        color: "red",
    },

})

export default ForumComment;