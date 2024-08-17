import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { useWallet } from "../context/walletProvider";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
  navigation: StackNavigationProp<any>;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const { sendVerification, loading } = useWallet();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendVerification = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      await sendVerification(email.toLowerCase());
      Alert.alert("Verification Sent", "Please check your email for the verification code.");
      navigation.navigate("Start2", { email: email.toLowerCase() });
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending the verification code.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}></View>
        <View style={styles.logoNameContainer}>
          <Text style={styles.logoNameText}>Agro Wallet</Text>
        </View>
        <View style={styles.emptyContainer}></View>
      </View>
      <View style={styles.insideContainer}>
        <View style={styles.logoBigContainer}>
          <Image
            style={styles.logoImage}
            source={require("../../assets/images/logos/logo-medium.png")}
          />
        </View>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome to Agro Wallet!</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputLabelTextContainer}>
            <Text style={styles.inputLabelText}>Email Address</Text>
          </View>
          <View style={styles.inputSelfContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"    
              selectionColor={"white"}
              placeholderTextColor="gray"
              cursorColor={"white"}
            />
          </View>
        </View>

        <View style={styles.buttonBiggerContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSendVerification}>
              <Text style={styles.buttonText}>Send Verification Code</Text>
            </TouchableOpacity>
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
    paddingTop: 40,
    paddingBottom: 30,
  },

  headerContainer: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 20,
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
  logo: {
    width: 30,
    height: 30,
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
  insideContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  logoBigContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
    zIndex: -1,
  },

  welcomeTextContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  welcomeText: {
    color: "white",
    fontFamily: "P7",
    fontSize: 28,
  },

  inputContainer: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    marginTop: 50,
  },
  inputLabelTextContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  inputLabelText: {
    color: "white",
    fontSize: 14,
    fontFamily: "P6",
  },
  inputSelfContainer: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#02DD48",
    marginTop: 4,
    position: "relative",
  },
  input: {
    width: "100%",
    color: "white",
    height: "100%",
    paddingLeft: 10,
    fontFamily: "P7",
  },

  buttonBiggerContainer: {
    width: "100%",
    justifyContent: "flex-end",
    marginTop: 60,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#00DE45",
    height: 52,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  buttonText: {
    fontFamily: "P8",
    fontSize: 16,
    color: "white",
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 60,
    display: "flex",
    alignItems: "center",
    marginTop: 50,
  },
  text: {
    color: "white",
    fontFamily: "P5",
    fontSize: 14,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#070707",
  },
});

export default Login;
