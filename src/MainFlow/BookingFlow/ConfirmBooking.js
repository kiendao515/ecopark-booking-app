
import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import ShortBikeCard from '../../shared/components/ShortBikeCard/ShortBikeCard';
import { getHeight, getWidth } from '../../shared/components/Responsive/Responsive';
import ScanScreen from '../../test/testcam';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { io } from 'socket.io-client';
import ImageSource from '../../shared/img';

const CONFIRM = 1;
const START = 2;
const END = 3;
const BILL = 4;


function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = ((date < 10)?'0'+date : date) + ' ' 
                + ((month < 10)?'0'+ month : month) + ' ' 
                + year + ' ' 
                + ((hour < 10)?'0'+ hour : hour) + ':' 
                + ((min < 10)?'0'+ min : min)  + ':' 
                + ((sec < 10)?'0'+ sec : sec) ;
    return time;
}

function ConfirmBooking({ navigation, route }) {
    const { info } = route.params
    const { option } = route.params
    const [qr, setQr] = useState("")
    const [QR, setQR] = useState("")
    const [isDisable, setIsDisable] = useState(false)
    const [total, setTotal] = useState(-1)
    const [isLoading, setIsLoading] = useState(true)
    const endStation = (info.billInfo != null)? info.billInfo.endStation: undefined
    const [endDate, setEndDate] = useState(0)
    const [beginDate, setBeginDate] = useState(0)
    const rentDate = info.rentDate
    const [bikeNumber, setBikeNumber] = useState("")
    const [billId, setBillId] = useState("")
    const [customer, setCustomer] = useState({})

    const socket = io.connect('http://3137-27-67-92-150.ngrok.io');

    const cancelBike = async () => {
        const token = await AsyncStorage.getItem("token")
        const url = "https://nmcnpm.herokuapp.com/api/v3/user/cancel/bike"
        axios.get(url, { headers: { "Authorization": "Bearer " + token } })
            .then(res => {
                if (res.data.status == "fail"){
                    navigation.navigate("Waiting", {
                        message: "timeout"
                    })
                } else {
                    navigation.navigate("Waiting", {
                        message: "cancleSuccessful"
                    })
                    setIsDisable(true)
                }
            })
    }

    const socketListener = () => {
        if (option == 2) {
            socket.on('rent_confirm', (data) => {
                navigation.goBack()
                if (data.data.status == "fail") {
                    if (data.data.msg == "station reject") {
                        navigation.navigate("Waiting", {
                            message: "stationReject"
                        })
                    } else {
                        navigation.navigate("Waiting", {
                            message: "stationUnfoundBike"
                        })
                    }
                } else {
                    navigation.navigate("Waiting", {
                        message: "successfulBooking"
                    })
                    setBeginDate(data.startTime)
                    setIsDisable(true)
                }
            })
        } else {
            socket.on('return_confirm', (data) => {
                navigation.goBack()
                if (data.data.status == "fail") {
                    if (data.data.msg == "station reject") {
                        navigation.navigate("Waiting", {
                            message: "stationReject"
                        })
                    } else {
                        navigation.navigate("Waiting", {
                            message: "stationUnfoundBike"
                        })
                    }
                } else {
                    navigation.navigate("Waiting", {
                        message: "successfulFinishing"
                    })
                    setEndDate(data.returnTime)
                    setTotal(data.data.bill.total)
                    setIsDisable(true)
                }
            })
        }
    }
    socketListener()

    const QRHandle = (value) =>{
        if (value == START && option == 2){
            navigation.navigate("QR", {callBack: (value) => {
                setQr(value)
            }})
        }
        if (value == END && option == 3) {
            navigation.navigate("QR", {
                callBack: (value) => {
                    setQR(value)
                }
            })
        }
    }

    const optionsProcess = () => {
        if (option == CONFIRM) {
            navigation.goBack()
            navigation.goBack()
            navigation.goBack()
            postBill()
        } else if (option == END) {
            if (QR != "")
                finishBillProcess()
        } else if (option == START){
            if (qr != "")
                startUsingProcess()
        } else navigation.goBack()
    }

    const finishBillProcess = async () => {
        const data = {
            idBill: info.billInfo._id,
            image: info.billInfo.bike.category.image,
            licensePlate: info.billInfo.bike.numberPlate,
            renderName: "Hello world",
            bikeCategory: info.billInfo.bike.category,
            timeRegister: info.billInfo.rentDate,
            socket_id: socket.id,
            stationName: info.stationName,
        }
        socket.emit("return", QR.split(":")[0], data);
        socket.emit("create", socket.id);
        navigation.navigate("Waiting", { message: "waiting" })
    }

    const startUsingProcess = async () => {
        const data = {
            idBill: info.billInfo._id,
            image: info.billInfo.bike.category.image,
            licensePlate: info.billInfo.bike.numberPlate,
            renderName: "Hello world",
            bikeCategory: info.billInfo.bike.category,
            timeRegister: info.billInfo.rentDate,
            socket_id: socket.id
        }
        socket.emit("rent", qr.split(":")[0], data);
        socket.emit("create", socket.id);
        navigation.navigate("Waiting", { message: "waiting" })
    }



    const postBill = async () => {
        const token = await AsyncStorage.getItem("token")
        const url = "https://nmcnpm.herokuapp.com/api/v3/user/confirm/bike/" + billId
        axios.get(url, { headers: { "Authorization": "Bearer " + token } })
            .then(res => {
                if (res.data.status == "success") {
                    navigation.navigate("BookingSuccess")
                } else {
                    console.log(res.data)
                }
            })
    }

    useEffect(() => {
        const getBike = async () => {
            const userInfo = await AsyncStorage.getItem("info")
            setCustomer(JSON.parse(userInfo))
            if (option == CONFIRM) {
                const token = await AsyncStorage.getItem("token")
                const data = {
                    stationID: info.stationId,
                    categoryID: info.bikeId
                }
                const url = "https://nmcnpm.herokuapp.com/api/v3/user/book/bike"
                axios.post(url, data, { headers: { "Authorization": "Bearer " + token } })
                    .then(res => {
                        console.log(res.data)
                        if (res.data.status == "false") {
                            navigation.goBack()
                            navigation.goBack()
                            navigation.goBack()
                            navigation.navigate("Waiting", {
                                message: "duplicateBooking"
                            });
                        } else {
                            setBikeNumber(res.data.bike.numberPlate)
                            setBillId(res.data.bill._id)
                            setIsLoading(false)
                        }
                    })
            } else if (option == START) {
                setIsLoading(false)
                setBikeNumber(info.billInfo.bike.numberPlate)
                setBeginDate(info.billInfo.rentDate)
            } else if (option == END) {
                setIsLoading(false)
                setBikeNumber(info.billInfo.bike.numberPlate)
                setBeginDate(info.billInfo.rentDate)
            } else if (option == BILL) {
                setIsLoading(false)
                setBikeNumber(info.billInfo.bike.numberPlate)
                setBeginDate(info.billInfo.rentDate)
                setEndDate(info.billInfo.endDate)
                setTotal(info.billInfo.total)
            }
        }
        getBike()
        return () => {
        }
    }, [])
    if (isLoading) {
        return <View style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <ActivityIndicator color={"#8DC63F"} size={50} />
        </View>
    }
    return (
        <View style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
        }}>
            <View style={styles.imageContainer}>
                <TouchableOpacity style={{
                }}
                    activeOpacity={0.3}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image
                        source={require("../../shared/img/back-button.png")}
                        style={{
                            height: 40,
                            width: 40,
                            resizeMode: "contain",
                        }}
                    />
                </TouchableOpacity>
                <Text style={{
                    marginLeft: 10,
                    fontFamily: "Quicksand-Bold",
                    fontSize: 22,
                    color: "black"
                }}>
                    {
                        (option == 1) ? "Confirm your information" :
                            (option == 2) ? "Get bike" :
                                "Billing"
                    }
                </Text>
            </View>

            <View style={{
                paddingHorizontal: 20,
                width: "100%",
            }}>
                <Image
                    source={{ uri: info.bikeInfo.image }}
                    style={{ ...styles.bikeImage }}
                />
            </View>

            <View
                style={{ ...styles.qrButton_container, marginTop: 10, }}
            >
                <TouchableOpacity style={{
                    ...styles.qrButton,
                    ...styles.columnCenter,
                    backgroundColor: (option == 1) ? "#F4F4F6" : "#8DC63F",
                }}
                    onPress={() => QRHandle(START)}
                >
                    <View style={styles.row_ct_sb}>
                        <Image
                            source={(option == 1) ?
                                require('../../shared/img/qr-code.png') :
                                require('../../shared/img/qr-code-512.png')
                            }
                            style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                            }}
                        />
                        <Text style={{
                            ...styles.qrButton_title,
                            color: (option != 1) ? "white" : "black",
                            marginLeft: 5,
                        }}>Begin</Text>
                    </View>
                    <Text style={{
                        color: (option != 1) ? "white" : "black",
                    }}>{(beginDate == 0 || beginDate == undefined) ? "..." : timeConverter(beginDate / 1000)}</Text>

                    <Text style={{
                        color: (option != 1) ? "white" : "black",
                    }}>{info.stationName}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    ...styles.qrButton,
                    ...styles.columnCenter,
                    backgroundColor: (option == 1) ? "#F4F4F6" : "#8DC63F",
                }}
                    onPress={() => {
                        QRHandle(END)
                    }}
                >
                    <View style={styles.row_ct_sb}>
                        <Image
                            source={(option == 1) ?
                                require('../../shared/img/qr-code.png') :
                                require('../../shared/img/qr-code-512.png')
                            }
                            style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                            }}
                        />
                        <Text style={{
                            ...styles.qrButton_title,
                            color: (option != 1) ? "white" : "black",
                            marginLeft: 5,
                        }}>End</Text>
                    </View>
                    <Text style={{
                        color: (option != 1) ? "white" : "black",
                    }}>
                        {(endDate == 0 || endDate == undefined) ? "..." : timeConverter(endDate / 1000)}
                    </Text>
                    <Text style={{
                        color: (option != 1) ? "white" : "black",
                    }}>
                        {(option == 4)?
                              (endStation == undefined)?"...":endStation.name
                            :(QR != "") ? QR.split(':')[1] : "..."}
                    </Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    marginTop: 10,
                    marginHorizontal: 20,
                    borderRadius: 15,
                    ...styles.columnCenter,
                    backgroundColor: "#F4F4F6",
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    alignItems: "flex-start",
                }}
            >
                <Text style={{ ...styles.infoContent, color: "black", fontFamily: "Quicksand-Bold", fontSize: 18 }}>Reverse Detail</Text>
                <View style={{ ...styles.row_ct_sb, marginTop: 10, }}>
                    <Image source={ImageSource.ConfirmCustomer} style={styles.icon} />
                    <Text style={styles.infoTitle}>Customer</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={styles.infoContent}>{customer.name}</Text>
                </View>

                <View style={{ ...styles.row_ct_sb, marginTop: 10, }}>
                    <Image source={ImageSource.ConfirmCustomer} style={styles.icon} />
                    <Text style={styles.infoTitle}>Bike number</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={styles.infoContent}>{bikeNumber}</Text>
                </View>

                <View style={{ ...styles.row_ct_sb, marginTop: 10, }}>
                    <Image source={ImageSource.ConfirmTime} style={styles.icon} />
                    <Text style={styles.infoTitle}>Booking time</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={styles.infoContent}>{(endDate == 0)?"...": ((endDate - rentDate)/1000/60).toFixed(2) + " mins"}</Text>
                </View>

                <View style={{ ...styles.row_ct_sb, marginTop: 10, }}>
                    <Image source={ImageSource.ConfirmStation} style={styles.icon} />
                    <Text style={styles.infoTitle}>Start Station</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={styles.infoContent}>{info.stationName}</Text>
                </View>

                <View style={{ ...styles.row_ct_sb, marginTop: 10, }}>
                    <Image source={ImageSource.ConfirmMoney} style={styles.icon} />
                    <Text style={styles.infoTitle}>Total</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={styles.infoContent}>{(total <= 0) ? "..." : currencyFormat(total)} VNĐ</Text>
                </View>

            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: "center",
                position: "absolute",
                bottom: 10,
                padding: 20,
            }}>
                {
                    (option == 2 ) ? <CustomButton
                        additionStyles={{
                            ...styles.buttonStyle,
                            backgroundColor: "red"
                        }}
                        onPress={() => {
                            if (!isDisable)
                                cancelBike()
                        }}
                        children={[
                            <Text key="1" style={{
                                fontFamily: "Quicksand-Bold",
                                fontSize: 24,
                                color: "white"
                            }}>Cancel</Text>]
                        }
                    ></CustomButton> : <View/>
                }
                {
                    (option == 2) ? <View style={{
                        width: 10,
                        height: 10,
                    }} /> : <View/>
                }
                <CustomButton
                    additionStyles={{
                        ...styles.buttonStyle,
                        width: (option == 2) ? "47%" : "94%"
                    }}
                    onPress={() => {
                        if (!isDisable)
                            optionsProcess()
                    }}
                    children={[
                        <Text key="1" style={{
                            fontFamily: "Quicksand-Bold",
                            fontSize: 24,
                            color: "white"
                        }}>{
                                (option == 1) ? "Confirm" :
                                    (option == 2) ? "Start using" : "Confirm"
                            }</Text>]
                    }
                />

            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    buttonStyle : {
        marginBottom: 10,
        borderRadius: 50,
        height: 60,
        flex: 1,
        backgroundColor: "#8DC63F",
    },
    imageContainer: {
        padding: 10,
        paddingTop: 30,
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-start",
        alignItems: "center",
        width: "100%"
    },
    infoContent: {
        fontFamily: "Quicksand-Medium",
        fontSize: 16,
        color: "#595C65",
    },
    infoTitle: {
        fontFamily: "Quicksand-Bold",
        fontSize: 16,
        color: "#595C65",
        marginLeft: 5,
    },
    icon: {
        height: 30,
        width: 30,
    },
    row_ct_sb: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    columnCenter: {
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    qrButton_container: {
        marginTop: 10,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    qrButton: {
        height: 80,
        width: "48%",
        borderRadius: 15,
    },
    qrButton_title: {
        fontFamily: "Quicksand-Bold",
        fontSize: 16,
        color: "#595C65"
    },
    bikeImage: {
        height: getHeight(286),
        width: "100%",
        borderRadius: 15,
        backgroundColor: "blue",
        resizeMode: "cover",
    },
})
export default ConfirmBooking