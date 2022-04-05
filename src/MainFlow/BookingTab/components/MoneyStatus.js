import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { getHeight, getWidth } from '../../../shared/components/Responsive/Responsive';

const MoneyStatus = ({ money, margin }) => {
    function currencyFormat(num) {
        if (num == 0)
            return "..."
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + "VND"
     }
    return (
        <View style={{
            margin: margin,
            paddingVertical: 20,
            paddingHorizontal: 15,
            flexDirection: "column",
            backgroundColor: "#E2F5F0",
            width: getWidth(351),
            borderRadius: 20,
        }}>
            <Text style={{
                fontFamily: "Quicksand-Medium",
                fontWeight: "normal",
                fontSize: 24,
                color: "black",
            }}>Money Remaining</Text>
            <Text style={{
                fontFamily: "Quicksand-Bold",
                marginTop: 8,
                fontSize: 24,
                color: "black",
            }}>{currencyFormat(money)}</Text>
        </View>
    )
}



export default MoneyStatus