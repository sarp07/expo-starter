import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Clipboard,
  Dimensions,
  Alert,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useWallet } from "../context/walletProvider";
import { useWalletBalance } from "thirdweb/react";
import { client } from "../../constants/thirdweb";

type Props = {
  navigation: StackNavigationProp<any>;
};

interface Token {
  id: string;
  tokenImage: any;
  tokenShortName: string;
  tokenCurrentValue: number;
  tokenIncreaseRate: string;
  tokenCurrentBalance: any;
}

interface NFT {
  nftId: string;
  nftImage: any;
}

const Main: React.FC<Props> = ({ navigation }) => {
  const { account, chain, logout } = useWallet();
  
  const [tokens, setTokens] = useState<Token[]>([
    {
      id: "1",
      tokenImage: require("../../assets/images/background-images/Main/Tokens/btc.png"),
      tokenShortName: "BTC",
      tokenCurrentValue: 20000,
      tokenIncreaseRate: "+5%",
      tokenCurrentBalance: "0.5",
    },
    {
      id: "2",
      tokenImage: require("../../assets/images/background-images/Main/Tokens/eth.png"),
      tokenShortName: "ETH",
      tokenCurrentValue: 3000,
      tokenIncreaseRate: "+3%",
      tokenCurrentBalance: "2.0",
    },
  ]);

  const [nfts, setNfts] = useState<NFT[]>([
    {
      nftId: "1",
      nftImage: require("../../assets/images/background-images/Main/Tokens/btc.png"),
    },
    {
      nftId: "2",
      nftImage: require("../../assets/images/background-images/Main/Tokens/eth.png"),
    },
  ]);

  const [walletAddress, setWalletAddress] = useState<string | undefined>("");
  const [isToken, setIsToken] = useState(true);
  const { data: walletBalance } = useWalletBalance({
    chain,
    address: walletAddress,
    client,
  });

  useEffect(() => {
    if (account?.address) {
      setWalletAddress(account.address);
    }
  }, [account]);

  const copyToClipboard = () => {
    if (walletAddress) {
      Clipboard.setString(walletAddress);
      Alert.alert("Copied", "Wallet address copied to clipboard");
    } else {
      console.error("Wallet address is undefined");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Logged out", "You have been logged out.");
      navigation.navigate("Start"); 
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Logout Error", "An error occurred during logout.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.chainContainer}>
          <Image
            style={styles.chainIcon}
            source={require("../../assets/images/logos/logo-medium.png")}
          />
          <Text style={styles.chainNameText}>Agro Network</Text>
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={copyToClipboard}>
            <View style={styles.iconContainer}>
              <Feather name="copy" size={15} color={"#00DE45"} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.totalBalanceContainer}>
        <Text style={styles.balanceText}>
          {walletBalance?.displayValue} {walletBalance?.symbol}
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => navigation.navigate("SendEnterAmount")}
        >
          <FontAwesome6 name="arrow-up" size={24} color="#fff" />
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.depositButton} onPress={() => navigation.navigate("Deposit")}>
          <Text style={styles.sendButtonText}>Deposit</Text>
          <FontAwesome6 name="arrow-down" size={24} color="#00DE45" />
        </TouchableOpacity>
      </View>
      <View style={styles.tokenNftButtonContainer}>
        <TouchableOpacity
          style={[styles.tokenButton, isToken ? styles.activeButton : {}]}
          onPress={() => setIsToken(true)}
        >
          <Text style={styles.buttonText}>TOKENS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nftButton, !isToken ? styles.activeButton : {}]}
          onPress={() => setIsToken(false)}
        >
          <Text style={styles.buttonText}>NFTS</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.scrollViewContainer}>
        {isToken ? (
          <FlatList
            data={tokens}
            key="tokens"
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("TokenDetails", { token: item })}
                style={styles.tokenItem}
              >
                <View style={styles.left}>
                  <View style={styles.logoPart}>
                    <Image source={item.tokenImage} style={styles.tokenLogo} />
                  </View>
                  <View style={styles.tokenNamePart}>
                    <Text style={styles.tokenShortNameText}>{item.tokenShortName}</Text>
                    <Text style={styles.tokenCurrentValueText}>
                      ${item.tokenCurrentValue} {item.tokenIncreaseRate}
                    </Text>
                  </View>
                </View>
                <View style={styles.right}>
                  <Text style={styles.tokenBalance}>{item.tokenCurrentBalance}</Text>
                  <Text style={styles.tokenBalanceValue}>
                    ${item.tokenCurrentBalance * item.tokenCurrentValue}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={nfts}
            key="nfts" // Change the key to force a re-render
            numColumns={2}
            keyExtractor={(item) => item.nftId}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("NftDetails", { nft: item })}
                style={styles.nftItem}
              >
                <Image source={item.nftImage} style={styles.nftImage} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <View style={styles.tabMenuContainer}>
        <View style={styles.tabMenuItem}>
          <Foundation name="home" size={26} color={"#00DE45"} />
          <Text style={styles.tabMenuText}>Home</Text>
        </View>
        <View style={styles.tabMenuItem}>
          <FontAwesome6 name="bolt-lightning" size={18} color={"white"} />
          <Text style={styles.tabMenuText}>Activity</Text>
        </View>
        <View style={styles.tabMenuItem}>
          <Ionicons name="notifications" size={20} color={"white"} />
          <Text style={styles.tabMenuText}>Notifications</Text>
        </View>
        <View style={styles.tabMenuItem}>
          <Ionicons name="settings" size={20} color={"white"} />
          <Text style={styles.tabMenuText}>Settings</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070707",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  chainContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chainIcon: {
    width: 20,
    height: 20,
  },
  chainNameText: {
    marginLeft: 10,
    color: "white",
    fontSize: 16,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "row",
    textShadowColor: "#ffff",
    color: "#fff",
  },
  totalBalanceContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  balanceText: {
    fontSize: 32,
    color: "white",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00DE45",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  depositButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "black",
    marginHorizontal: 10,
    fontSize: 18,
  },
  tokenNftButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  tokenButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#252525",
  },
  nftButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#252525",
  },
  activeButton: {
    backgroundColor: "#00DE45",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  scrollViewContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tokenItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoPart: {
    marginRight: 10,
  },
  tokenLogo: {
    width: 40,
    height: 40,
  },
  tokenNamePart: {
    flexDirection: "column",
  },
  tokenShortNameText: {
    color: "white",
    fontSize: 18,
  },
  tokenCurrentValueText: {
    color: "#B9B9B9",
    fontSize: 14,
  },
  right: {
    alignItems: "flex-end",
  },
  tokenBalance: {
    color: "white",
    fontSize: 18,
  },
  tokenBalanceValue: {
    color: "#B9B9B9",
    fontSize: 14,
  },
  nftItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  nftImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  tabMenuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "gray",
    paddingTop: 10,
  },
  tabMenuItem: {
    alignItems: "center",
  },
  tabMenuText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
});

export default Main;
