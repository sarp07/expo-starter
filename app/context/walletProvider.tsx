"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  inAppWallet,
  preAuthenticate,
  getUserEmail,
  hasStoredPasskey
} from "thirdweb/wallets/in-app";
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
  useWalletBalance,
} from "thirdweb/react";
import { client } from "@/constants/thirdweb";
import { defineChain } from "thirdweb";

interface WalletContextProps {
  account: any;
  email: string | undefined;
  isAuthenticated: boolean;
  loading: boolean;
  sendVerification: (email: string) => Promise<void>;
  handleLogin: (email: string, verificationCode: string) => Promise<void>;
  logout: () => void;
  userWallet: any;
  nativeBalance: any;
  nativeSymbol: any;
  fetchNativeBalance: (address: string) => void;
  chain: any;
  handleLoginPasskey: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [nativeBalance, setNativeBalance] = useState("");
  const [nativeSymbol, setNativeSymbol] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const account = useActiveAccount();
  const userWallet = useActiveWallet();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const wallet = inAppWallet({
    auth:{
        passkeyDomain: "localhost",
        redirectUrl: "localhost",
        redirectExternally: false,
        mode: "popup", 
    }
  });
  const chain = defineChain({
    id: 3452,
    rpc: "https://rpc.agrotest.online/",
    nativeCurrency: {
      name: "AGRO Global",
      symbol: "AGRO",
      decimals: 18,
    },
  });

  const fetchNativeBalance = async (address: string) => {
    try {
      const { data: nativeBalanceData, isLoading: nativeBalanceLoading, isError: nativeBalanceError } = useWalletBalance({
        chain,
        address: address,
        client,
      });

      if (nativeBalanceData) {
        setNativeBalance(nativeBalanceData?.displayValue || "0");
        setNativeSymbol(nativeBalanceData?.symbol || "AGRO");
        console.log("balance", nativeBalanceData.displayValue, nativeBalanceData.symbol);
      } else if (nativeBalanceError) {
        console.error("Error fetching balance");
      } else if (nativeBalanceLoading) setLoading(true);
    } catch (error) {
      console.error(error, "Error fetching balance");
    }
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const userEmail = await getUserEmail({ client });
        setEmail(userEmail);
      } catch (error) {
        console.error("Error retrieving user email:", error);
      }
    };

    if (account) {
      setIsAuthenticated(true);
      fetchEmail();
    } else {
      setIsAuthenticated(false);
      setEmail(undefined);
      setNativeBalance("");
    }
  }, [account]);

  const sendVerification = async (email: string) => {
    try {
      setLoading(true);
      await preAuthenticate({
        client,
        strategy: "email",
        email: email.toLowerCase(),
      });
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, verificationCode: string) => {
    try {
      setLoading(true);
      await connect(async () => {
        await wallet.connect({
          client,
          strategy: "email",
          email: email.toLowerCase(),
          verificationCode,
        });
        return wallet;
      });
      setIsAuthenticated(true);
      const userEmail = await getUserEmail({ client });
      setEmail(userEmail);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPasskey = async () => {
    try {
      setLoading(true);
      await connect(async () => {
        const hasPasskey = await hasStoredPasskey(client);
        await wallet.connect({
          client,
          strategy: "passkey",
          type: hasPasskey ? "sign-in" : "sign-up",
        });
        return wallet;
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      if (userWallet) {
        await disconnect(userWallet);
      }
      setIsAuthenticated(false);
      setEmail(undefined);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        userWallet,
        fetchNativeBalance,
        nativeSymbol,
        chain,
        nativeBalance,
        account,
        email,
        isAuthenticated,
        loading,
        sendVerification,
        handleLogin,
        handleLoginPasskey,
        logout,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
