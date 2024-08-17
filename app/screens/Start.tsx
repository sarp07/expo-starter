import React, { useEffect } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useActiveAccount } from "thirdweb/react";

type Props = {
    navigation: StackNavigationProp<any>;
}

const Start: React.FC<Props> = ({ navigation }) => {
    const activeAccount = useActiveAccount();
    useEffect(() => {
      if(activeAccount?.address) {
        navigation.navigate("Main");
      }
    }, [navigation, activeAccount])
    
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image style={styles.logo} source={require('../../assets/images/logos/logo-medium.png')} />
                <Text style={[styles.headerText]}>Agro Wallet</Text>
            </View>
            <View style={styles.mainContainer}>
                <Image style={styles.backgroundImage} source={require('../../assets/images/background-images/GetStarted/bubble.png')} />
                <View style={{ flex: 2 }}></View>
                <View style={styles.mainTextContainer}>
                    <Text style={{ color: "white", fontFamily: "P7", fontSize: 44, marginTop: -16 }}>
                        Earn Money
                    </Text>
                    <Text style={{ color: "white", fontFamily: "P7", fontSize: 44, marginTop: -16 }}>
                        Trade Crypto
                    </Text>
                    <Text style={{ color: "white", fontFamily: "P7", fontSize: 44, marginTop: -16 }}>
                        Spend Cash
                    </Text>
                    <Text style={{ color: "#00DE45", fontFamily: "P7", fontSize: 44, marginTop: -16 }}>
                        Anywhere
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("Starter")}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                    <View style={styles.helpContainer}>
                        <Text style={styles.helpText}>
                            Do you need help? Contact <Text style={{ fontFamily: "P8", color: "#00DE45" }}>Agro</Text> now!
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#070707",
        paddingTop: 20,
    },
    headerContainer: {
        width: "100%",
        height: 32,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 20,
    },
    logo: {
        height: 28,
        width: 28,
    },
    headerText: {
        color: "white",
        fontSize: 21,
        fontFamily: "P7",
    },
    mainContainer: {
        flex: 1,
        width: "100%",
        height: "auto",
        position: "relative",
        flexDirection: "column",
    },
    backgroundImage: {
        flex: 1,
        zIndex: 120,
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
    },
    mainTextContainer: {
        flex: 2,
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 40,
        gap: 0,
        paddingTop: 40,
    },
    buttonContainer: {
        flex: 1,
        width: "100%",
        display: "flex",
        paddingHorizontal: 20,
        justifyContent: "space-between",
        paddingBottom: 0,
        position: "relative",
        zIndex: 500,
    },
    button: {
        width: "100%",
        backgroundColor: "#00DE45",
        height: 52,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontFamily: "P8",
        fontSize: 16,
        color: "white",
    },
    helpContainer: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginBottom: 46,
    },
    helpText: {
        color: "white",
        fontFamily: "P5",
    },
});

export default Start;
