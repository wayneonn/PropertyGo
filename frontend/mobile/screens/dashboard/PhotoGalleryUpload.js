import {ImageUpload} from "../../components/Partner/ImageUpload";
import {useState} from "react";
import {View, Text} from "react-native";


export const PhotoGalleryUpload = () => {
    const [image, setImage] = useState([])
    return (
        <View>
            <Text>Upload your images here.</Text>
            <ImageUpload images={image} setImages={setImage}/>
        </View>
    )
}