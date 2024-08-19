import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RNCamera } from "react-native-camera";
import { prepareTransaction, toWei } from "thirdweb";
import { toEther } from "thirdweb/utils";
import { useWallet } from "../context/walletProvider";
import { client } from "../../constants/thirdweb";
import { useEstimateGas } from "thirdweb/react";

type SendEnterAmountProps = {
  navigation: StackNavigationProp<any>;
};


const SendEnterAmount: React.FC<SendEnterAmountProps> = ({ navigation }) => {
  const { chain, account,  } = useWallet();
  const [amount, setAmount] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);

  const nativeCoinBalance = 10.5; // Assume this is the user's native coin balance
  const nativeCoinValue = 1.0; // Assume 1 native coin = $1 for simplicity
  const nativeCoinSymbol = "NATIVE"; // Replace with actual native coin symbol, e.g., "ETH", "BNB"
  const estimatedGasFee = 0.001; // Assume a gas fee value for simplicity

  const handleSetAmount = (text: string) => {
    const firstDecimalIndex = text.indexOf(".");
    let cleanedText = text.replace(/[^0-9.,]/g, "");

    if (firstDecimalIndex !== -1) {
      const invalidDecimals = cleanedText
        .slice(firstDecimalIndex + 2)
        .match(/\./g);
      if (invalidDecimals && invalidDecimals.length > 0) {
        cleanedText = cleanedText.substring(
          0,
          cleanedText.indexOf(".", firstDecimalIndex + 1)
        );
      }
    }

    const normalizedText = cleanedText.replace(/,/g, ".");
    const newAmount = parseFloat(normalizedText) || 0;

    setAmount(Math.min(newAmount, nativeCoinBalance).toString());
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanning(false);
    setWalletAddress(data);
  };

  const totalAmountWithFees = (
    parseFloat(amount) + estimatedGasFee
  ).toFixed(4);

  return (
    <SafeAreaView style={styles.container}>
      {scanning ? (
        <RNCamera
          style={StyleSheet.absoluteFillObject}
          onBarCodeRead={handleBarCodeScanned}
        >
          <View style={styles.scanContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScanning(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </RNCamera>
      ) : (
        <>
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
              <Text style={styles.logoNameText}>Send</Text>
            </View>
            <View style={styles.emptyContainer}></View>
          </View>
          <View style={styles.tokenContainer}>
            <View style={styles.inputWithIconContainer}>
              <TextInput
                style={styles.walletAddressInput}
                placeholder="Enter Wallet Address"
                placeholderTextColor="#B9B9B9"
                value={walletAddress}
                onChangeText={setWalletAddress}
              />
              <TouchableOpacity onPress={() => setScanning(true)}>
                <Ionicons name="camera" size={24} color="#00DE45" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sendToText}>Send to</Text>
          </View>
          <View style={styles.lineOuterContainer}>
            <View style={styles.lineContainer}></View>
          </View>
          <View style={styles.amountContainer}>
            <View style={styles.maxButtonContainer}>
              <TouchableOpacity
                style={styles.maxButton}
                onPress={() => setAmount(nativeCoinBalance.toString())}
              >
                <Text style={{ color: "white", fontFamily: "P6", fontSize: 13 }}>
                  MAX
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.input}
                selectionColor={"white"}
                placeholder={"0.000"}
                placeholderTextColor="#B9B9B9"
                value={amount}
                onChangeText={handleSetAmount}
                keyboardType="numeric"
              />
              <View style={styles.amountValueContainer}>
                <Text style={{ color: "#B9B9B9" }}>
                  = ${(nativeCoinValue * parseFloat(amount)).toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.tokenTypeContainer}>
              <Text style={{ color: "white", fontFamily: "P8", fontSize: 18 }}>
                {nativeCoinSymbol}
              </Text>
            </View>
          </View>
          <View style={styles.lineOuterContainer}>
            <View style={styles.lineContainer}></View>
          </View>
          <View style={styles.tokenContainer}>
            <Text style={styles.estimateText}>
              Estimated Gas Fee: {estimatedGasFee} {nativeCoinSymbol}
            </Text>
            <Text style={styles.totalText}>
              Total: {totalAmountWithFees} {nativeCoinSymbol}
            </Text>
          </View>
          <View style={styles.sendButtonContainer}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => console.log("Send transaction triggered")}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
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
    paddingTop: 30,
    height: 60,
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
  tokenContainer: {
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "column",
    marginTop: 30,
    gap: 8,
  },
  inputWithIconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#B9B9B9",
  },
  walletAddressInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 10,
    fontFamily: "P6",
  },
  sendToText: {
    color: "#B9B9B9",
    fontFamily: "P6",
    fontSize: 12,
    marginTop: 5,
  },
  lineOuterContainer: {
    width: "100%",
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  lineContainer: {
    width: "100%",
    height: 1,
    backgroundColor: "#00de46ba",
  },
  amountContainer: {
    width: "100%",
    paddingHorizontal: 20,
    height: 100,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    gap: 15,
  },
  maxButtonContainer: {
    flex: 2,
    height: "auto",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  amountInputContainer: {
    flex: 5,
    height: "100%",
    width: "100%",
  },
  tokenTypeContainer: {
    flex: 2,
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  maxButton: {
    width: "auto",
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: "#252525",
  },
  input: {
    backgroundColor: "black",
    width: "100%",
    height: 36,
    paddingLeft: 10,
    paddingRight: 20,
    fontSize: 20,
    fontFamily: "P8",
    color: "white",
    textAlign: "center",
  },
  amountValueContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  estimateText: {
    color: "#B9B9B9",
    fontSize: 14,
    fontFamily: "P6",
  },
  totalText: {
    color: "white",
    fontSize: 16,
    fontFamily: "P8",
    marginTop: 5,
  },
  sendButtonContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    width: "80%",
    backgroundColor: "#00DE45",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "P8",
  },
  scanContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  cancelButton: {
    backgroundColor: "#00DE45",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "P8",
  },
});

export default SendEnterAmount;
