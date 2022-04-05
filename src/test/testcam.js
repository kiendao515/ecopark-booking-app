'use strict';

import React, { Component, useState } from 'react';
import { io } from 'socket.io-client';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import CustomButton from '../shared/components/CustomButton/CustomButton';

const socket = io.connect('http://f1f2-171-255-68-171.ngrok.io');
socket.on('rent_confirm',(data)=>{
  console.log(data)
})
const ScanScreen = ({navigation, route}) => {
  const { callBack } = route.params
  const [info, setInfo] = useState("");
    return (
      <QRCodeScanner
        showMarker={true}
        onRead={(e) => {
          setInfo(e.data); 
        }}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <View style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
          }}>
              <Text style={{
                fontFamily: "Quicksand-Bold",
                fontSize: 20,
              }}>
                Scan your end station to finish the trip
              </Text>
          </View>
        }
        bottomContent={
            <CustomButton
                onPress={() => {

                  callBack(info)
                  navigation.goBack()
                }}
                additionStyles={{
                    marginBottom: 10,
                    borderRadius: 50,
                    height: 60,
                    width: "95%",
                    backgroundColor: "#8DC63F",
                    position: "absolute",
                    bottom: 20,
                }}
                children={[
                    <Text 
                        key="1"
                        style={{
                            fontFamily: "Quicksand-Bold",
                            fontSize: 18,
                            color: "white",
                        }}
                    >{(info == "")?"Scanning":info.split(':')[1]}</Text>
                ]}
            />
        }
      />
    );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});

export default ScanScreen;