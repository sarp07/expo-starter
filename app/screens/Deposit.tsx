import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Clipboard } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useWallet } from "../context/walletProvider";

type Token = {
  key: string;
  tokenName: string;
  tokenShortName: string;
};

type props = {
  navigation: StackNavigationProp<any>;
};

const Deposit: React.FC<props> = ({ navigation }) => {
  const { account } = useWallet(); 

  const handleCopy = async (text: string) => {
    await Clipboard.setString(text);
    alert("Address copied to clipboard!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => navigation.navigate("Main")}
          >
            <FontAwesome6 name="arrow-left" size={16} color={"#00DE45"} />
          </TouchableOpacity>
        </View>
        <View style={styles.logoNameContainer}>
          <Text style={styles.logoNameText}>Deposit Token</Text>
        </View>
        <View style={styles.emptyContainer}></View>
      </View>
      <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 30 }}>
        <Text style={{ color: "white", fontFamily: "P7", fontSize: 26 }}>
          Deposit
        </Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={{ color: "#B9B9B9", fontFamily: "P6" }}>
          Wallet Address
        </Text>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => handleCopy(account.address)} 
        >
          <Ionicons
            name="copy"
            color={"#00DE45"}
            size={20}
            style={{ marginTop: -3 }}
          />
          <Text style={{ color: "white", fontFamily: "P6", fontSize: 11 }}>
            {account.address}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <QRCode
          value={account?.address}
          logo={require("../../assets/images/logos/logo-medium.png")}
          logoSize={60}
          logoBackgroundColor="black"
          logoMargin={15}
          logoBorderRadius={10}
          size={260}
          backgroundColor="white"
        />
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
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 40,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoNameContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoNameText: {
    fontSize: 15,
    fontFamily: "P7",
    color: "white",
  },
  emptyContainer: {
    width: 40,
    height: "100%",
  },
  backButtonContainer: {
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addressContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 30,
    display: "flex",
    gap: 8,
  },
  copyButton: {
    display: "flex",
    flexDirection: "row",
    height: 44,
    backgroundColor: "#252525",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: -4,
    gap: 12,
  },
});

export default Deposit;
