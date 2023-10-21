import {View} from "react-native";
import StarRating from "react-native-star-rating";
import React from "react";

export const RatingComponent = ({ rating }) => {
    return (
        <View>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                starSize={15}
                fullStarColor={'gold'}
            />
        </View>
    );
};