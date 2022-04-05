
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { getHeight, getWidth } from '../../../shared/components/Responsive/Responsive';

const GetBikeButton = ({ marginTop, onPress }) => {
    return (
        <View style={{
            marginTop: marginTop,
            flexDirection: "column",
            backgroundColor: "#8DC63F",
            width: getWidth(351),
            height: getHeight(150),
            borderRadius: 20,
            paddingHorizontal: 21,
            paddingVertical: 25,
        }}>
            <Text style={{
                fontSize: 18,
                fontFamily: "Quicksand-Bold",
                color: "white"
            }}>
                You have a bike, let's get it!
            </Text>
            <Text style={{
                marginTop: 8,
                fontSize: 14,
                color: "white"
            }}>Let’s help you to pick your bike</Text>
            <TouchableOpacity style={{
                marginTop: 8,
                height: getHeight(54),
                width: getWidth(302),
                backgroundColor: "#FDFD7F",
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
                activeOpacity={0.3}
                onPress={onPress}
            >
                <Text style={{
                    fontFamily: "Quicksand-Bold",
                    fontSize: 24,
                    color: "#8DC63F"
                }}>
                    Get it now
                </Text>
            </TouchableOpacity>
        </View >
    )
}

export default GetBikeButton