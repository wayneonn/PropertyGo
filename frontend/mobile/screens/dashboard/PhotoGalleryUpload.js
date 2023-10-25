import {ImageUpload} from "../../components/Partner/ImageUpload";
import {useState} from "react";
import {View} from "react-native";


export const PhotoGalleryUpload = () => {
    const [image, setImage] = useState([])
    return (
        <View>
            <ImageUpload images={image} setImages={setImage}/>
        </View>
    )
}