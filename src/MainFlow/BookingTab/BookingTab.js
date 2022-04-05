import React, { useEffect, useState } from 'react';
import { View, Button, Image, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { getHeight, getWidth } from '../../shared/components/Responsive/Responsive';
import MoneyStatus from './components/MoneyStatus';
import BookingButton from './components/BookingButton';
import ShortBikeCard from '../../shared/components/ShortBikeCard/ShortBikeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { is, isLabeledStatement } from '@babel/types';
import GetBikeButton from './components/GetBikeButton';
import axios from 'axios';

const bikeInfo ={
    "__v": 0, 
    "_id": "61a3b081afcfae3b5c9df498", 
    "cost": 20000, 
    "description": "With the development of the era,around 2013, various factories have continuously launched medium-frame wheels: Campagnolo Bora 35, Fulcrum Racing Speed 35, Shimano Dura-ACE C35, etc. After several years of developing carbon fiber rim technology, the average high-frame wheel weighs almost as much as a low-frame off-road bike wheel, but it has better aerodynamic performance, which can take into account journeys on flat roads", 
    "image":"https://th.bing.com/th/id/OIP.eaUkdivTED0KbxsXhyjwzwHaF2?w=274&h=216&c=7&r=0&o=5&dpr=1.25&pid=1.7", 
    "isDelete": false, "name": "Fulcrum Racing Light xlr, Shimano Dura-ACE C24"
}

function BookingTab({ navigation }) {
    const [userInfo, setuserInfo] = useState({})
    const [IsLoading, setIsLoading] = useState(true)
    const [isBooking, setIsBooking] = useState(false)
    useEffect(() => {
        async function checkStorageToken() {
            setIsLoading(true)
            const url = "https://nmcnpm.herokuapp.com/api/v1/user/login"
            const token = await AsyncStorage.getItem('token');
            await axios.post(url, {}, {
                headers: { "Authorization": "Bearer " + token }
                }).then((response) => {
                    const data = response.data.data
                    const isBooking = JSON.stringify(response.data.check);
                    const token = response.data.token
                    AsyncStorage.setItem("token", token)
                    AsyncStorage.setItem("info", JSON.stringify(data))
                    AsyncStorage.setItem("isBooking",JSON.stringify(isBooking))
                    setIsBooking(response.data.check)
                    setuserInfo(data)
                    setIsLoading(false)
            })
        }
        checkStorageToken()
        const willFocusSubscription = navigation.addListener('focus', () => {
            checkStorageToken()
        });
        return willFocusSubscription
    }, [])

    return (
        <ScrollView
            contentContainerStyle={styles.scrollviewContainer}
        >
            <View style={{
                height: 295,
            }}>
                <Text style={styles.welcomeTitle}>Welcome Back, {userInfo.name}</Text>
                <Text style={styles.welcomeSubtitle}>Let's help you to pick your vehicle</Text>
                <Image
                    source={require("../../shared/img/main-image.png")}
                    style={styles.topImage}
                />
                <View style={{
                    top: 170,
                }}>
                    <MoneyStatus margin={13} money={(IsLoading)?0:userInfo.balance} />
                </View>
            </View>
            {
                (isBooking)?
                    <GetBikeButton
                        marginTop={20}
                        onPress={() => {
                            navigation.navigate("History")
                        }}
                    />
                : <BookingButton
                        marginTop={20}
                        onPress={() => {
                            navigation.navigate("PickStation")
                        }}
                    />
            }

            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Top Bike
                </Text>
            </View>
            <ShortBikeCard backgroundColor={"rgba(255,255,0,1)"} bikeInfo={bikeInfo} onPress={() => { }} />
            <ShortBikeCard backgroundColor={"rgb(211,211,211)"} bikeInfo={bikeInfo} onPress={() => { }} />
            <ShortBikeCard backgroundColor={"rgb(237, 177, 119)"} bikeInfo={bikeInfo} onPress={() => { }} />
        </ScrollView  >
    );
}

const styles = StyleSheet.create({
    scrollviewContainer: {
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        alignItems: "center",
        paddingBottom: 10,
    },
    welcomeTitle: {
        fontFamily: "Quicksand-Bold",
        fontSize: 24,
        color: "white",
        position: "absolute",
        top: 90,
        left: 15,
        zIndex: 1,
    },
    welcomeSubtitle: {
        fontFamily: "Quicksand-Medium",
        fontSize: 18,
        color: "white",
        position: "absolute",
        top: 120,
        left: 15,
        zIndex: 1,
    },
    topImage: {
        width: getWidth(),
        height: 470 / 1500 * getHeight(),
        position: "absolute",
    },
    titleContainer: {
        paddingLeft: 15,
        marginTop: 10,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-start",
        justifyContent: "flex-start",

    },
    title: {
        fontFamily: "Quicksand-Bold",
        color: "black",
        fontSize: 20,
    },

})
export default BookingTab