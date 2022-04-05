import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, TextInputBase, View, Text, Button } from 'react-native';
import { Waiting, UserFrame, ForgetPassword, Landing, Loading, Login, Register, ResetPassword, NonactiveAccount, } from './src/screen/Screens/Screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainFlow from './src/MainFlow/MainFlow';
import PickStation from './src/MainFlow/BookingFlow/PickStation';
import PickBike from './src/MainFlow/BookingFlow/PickBike';
import ProfileDetail from './src/MainFlow/ProfileTab/components/ProfileDetail';
import ChangePassword from './src/MainFlow/ProfileTab/components/ChangePassword';
import ShowBikeInfo from './src/MainFlow/BookingFlow/components/ShowBikeInfo';
import ConfirmBooking from './src/MainFlow/BookingFlow/ConfirmBooking';
import axios from 'axios';
import BookingSuccess from './src/MainFlow/BookingFlow/BookingSuccess';
import ScanScreen from './src/test/testcam';

const Stack = createNativeStackNavigator();
const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'white',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

const LOADING = "LOADING"
const FIRSTIME = "FIRSTIME"
const SECONDTIME = "SECONDTIME"
const LOGIN = "LOGIN"
const route = {
  FIRSTIME: "Landing",
  SECONDTIME: "Login",
  LOGIN: "MainFlow",
}
const App = () => {
  const [role, setRole] = useState(LOADING)

  useEffect(() => {
    async function checkStorageToken() {
      try {
        const url = "https://nmcnpm.herokuapp.com/api/v1/user/login"
        const token = await AsyncStorage.getItem('token');
        if (token === null) { // Đăng nhập lần đầu 
          setRole(FIRSTIME)
        } else {
          axios.post(url, {}, {
            headers: { "Authorization": "Bearer " + token }
          }).then((response) => {
            if (response.data.status == "fail") {
              setRole(SECONDTIME)
            } else {
              const data = response.data.data
              const isBooking = JSON.stringify(response.data.check);
              const token = response.data.token
              AsyncStorage.setItem("token", token)
              AsyncStorage.setItem("info", JSON.stringify(data))
              AsyncStorage.setItem("isBooking",JSON.stringify(isBooking))
              setRole(LOGIN)
            }
          })
        }
      } catch (error) {
      }
    }
    checkStorageToken()
  }, []); // Or [] if effect doesn't need props or state

  if (role !== LOADING) {
    return (
      <NavigationContainer theme={MyTheme}>
        <StatusBar hidden={true} />
        <Stack.Navigator
          initialRouteName={route[role]}
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="QR" component={ScanScreen}/>
          <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
          <Stack.Screen name="ConfirmBooking" component={ConfirmBooking} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
          <Stack.Screen name="MainFlow" component={MainFlow} />
          <Stack.Screen name="PickStation" component={PickStation} />
          <Stack.Screen name="PickBike" component={PickBike} />
          <Stack.Screen name="ShowBikeInfo" component={ShowBikeInfo} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Loading" component={Loading} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="NonactiveAccount" component={NonactiveAccount} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="UserFrame" component={UserFrame} />
          <Stack.Screen
            name="Waiting"
            component={Waiting}
            options={{ presentation: 'transparentModal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return <Loading></Loading>
  }
}

export default App;