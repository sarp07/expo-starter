import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useWallet } from "../context/walletProvider";

type Props = {
  navigation: StackNavigationProp<any>;
  route: {
    params: {
      email: any;
    };
  };
};

type TextInputElement = React.ElementRef<typeof TextInput>;

const Start2: React.FC<Props> = ({ navigation, route }) => {
  const { handleLogin, loading } = useWallet();
  const { email } = route.params;
  const [pins, setPins] = useState<string[]>(Array(6).fill(""));
  const inputs = useRef<(TextInputElement | null)[]>([]);

  const handlePinChange = (text: string, index: number) => {
    const newPins = [...pins];
    newPins[index] = text;
    setPins(newPins);

    if (text && index < 5 && inputs.current[index + 1]) {
      inputs.current[index + 1]?.focus();
    }
  };

  const submitLogin = async () => {
    const verificationCode = pins.join('');
    try {
      await handleLogin(email.toLowerCase(), verificationCode);
      Alert.alert("Success", "Login successful!");
      navigation.navigate("Main");
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Login Error", "Error during login. Please try again.");
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
      <Text style={styles.text}>Enter OTP code:</Text>
      <View style={styles.pinContainer}>
        {pins.map((pin, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            style={styles.pinInput}
            onChangeText={(text) => handlePinChange(text, index)}
            value={pin}
            keyboardType="numeric"
            maxLength={1}
            textContentType="oneTimeCode"
          />
        ))}
      </View>
      <View style={styles.buttonBiggerContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={submitLogin}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#070707",
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pinInput: {
    width: 40,
    height: 50,
    borderRadius: 10,
    borderColor: "#02DD48",
    borderWidth: 2,
    color: "white",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#070707",
  },
});

export default Start2;
