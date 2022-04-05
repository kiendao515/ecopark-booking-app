
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { getHeight, getWidth } from '../../../shared/components/Responsive/Responsive';

const BookingButton = ({ marginTop, onPress }) => {
    return (
        <View style={{
            marginTop: marginTop,
            flexDirection: "column",
            backgroundColor: "#E2F5F0",
            width: getWidth(351),
            height: getHeight(150),
            borderRadius: 20,
            paddingHorizontal: 21,
            paddingVertical: 25,
        }}>
            <Text style={{
                fontSize: 18,
                fontFamily: "Quicksand-Bold",
            }}>
                You need a bike?
            </Text>
            <Text style={{
                marginTop: 8,
                fontSize: 14,
            }}>Let’s help you to get a bike</Text>
            <TouchableOpacity style={{
                marginTop: 8,
                height: getHeight(54),
                width: getWidth(302),
                backgroundColor: "#8DC63F",
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
                    color: "white"
                }}>
                    Book now
                </Text>
            </TouchableOpacity>
        </View >
    )
}

export default BookingButton