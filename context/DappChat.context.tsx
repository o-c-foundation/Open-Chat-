"use client";

import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import { toast } from "@/components/common/Toast";
import { useRouter } from "next/navigation";

import {
  FriendListType,
  MessagesType,
  UserList,
  initialState,
  InitialStateInterface,
} from "@/context/ChatTypes";
import { connectToSmartContract } from "@/lib/Api";

export const ChatContext = createContext<InitialStateInterface>(initialState);

export const ChatProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [friendList, setFriendList] = useState<FriendListType[]>([]);
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [userList, setUserList] = useState<UserList[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [registeredUser, setRegisteredUser] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [checkMetamask, setCheckMetamask] = useState<boolean>(false);

  const router = useRouter();

  const fetchUserData = async () => {
    try {
      if (!account) return;
      const contract = await connectToSmartContract();
      const friendsArray = await contract.getFriends();
      setFriendList(friendsArray);
      const getAllUsers = await contract.getAllAppUsers();
      setUserList(getAllUsers);
      const getBlockedUsers = await contract.getAllBlockedUsers();
      setBlockedUsers(getBlockedUsers);
      const getUserNickname = await contract.getUsername(account);
      setUsername(getUserNickname);
    } catch (err) {
      toast({
        title: "Error fetching user data",
        message:
          "It seems you don't have an account created. Please create an account to use the application.",
        type: "error",
      });
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        setCheckMetamask(false);
      } else {
        const walletAccounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setCheckMetamask(true);
        if (walletAccounts.length) {
          setAccount(walletAccounts[0]);
        }
        window.ethereum.on("accountsChanged", (accounts: string) => {
          if (accounts.length) {
            setAccount(accounts[0]);
          } else {
            setAccount("");
          }
        });
      }
    } catch (e) {
      toast({
        title: "Wallet is not connected",
        message: "Please download Metamask",
        type: "error",
      });
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setCheckMetamask(false);
        return;
      }

      await window.ethereum.enable();
      const walletAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(walletAccounts[0]);
      setCheckMetamask(true);
    } catch (e) {
      toast({
        title: "Wallet is not connected",
        message: "Please connect your wallet to use the application.",
        type: "error",
      });
    }
  };

  const createAccount = async ({ name, marketingOptIn = false }: { name: string, marketingOptIn?: boolean }): Promise<void> => {
    setIsLoading(true);
    try {
      const contract = await connectToSmartContract();
      if (!name || !contract) return;
      const newUser = await contract.createUser(name);
      setRegisteredUser(newUser);
      await newUser.wait();
      setIsLoading(false);

      // Store marketing preferences
      if (typeof window !== "undefined") {
        // Store marketing preference in localStorage
        localStorage.setItem(`marketing_optin_${account}`, marketingOptIn ? "true" : "false");
        window.location.reload();
      }

      if (newUser) {
        toast({
          title: "Happy Chatting!",
          message: "Successfully created an account.",
          type: "success",
        });
      }

      router.push("/users");
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error creating an account",
        message:
          "It seems the account already exists. Please try again using another wallet.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async ({
    content,
    address,
  }: {
    content: string;
    address: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      if (!content || !address) return;
      
      // Try to use the session wallet if it exists and is verified
      const contract = await connectToSmartContract();
      const newMessage = await contract.sendMessage(address, content);
      await newMessage.wait();
      setIsLoading(false);
      
      if (newMessage) {
        toast({
          title: "Message Sent!",
          message: "Successfully sent a message to your friend.",
          type: "success",
        });
      }
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error sending a message",
        message:
          "There seems to be an error sending a message. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleAddFriend = async ({
    address,
    name,
  }: {
    address: string;
    name: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      if (!address || !name) return;
      const contract = await connectToSmartContract();
      console.log(`[handleAddFriend] Adding friend: ${name} (${address})`);
      
      // Check if the user exists before trying to add
      try {
        const friendUsername = await contract.getUsername(address);
        console.log(`[handleAddFriend] Friend username: ${friendUsername}`);
      } catch (error) {
        console.error("[handleAddFriend] Error checking friend username:", error);
        throw new Error("User is not registered");
      }
      
      const newFriend = await contract.addFriend(address, name);
      console.log("[handleAddFriend] Friend request sent, waiting for confirmation...");
      await newFriend.wait();
      console.log("[handleAddFriend] Friend request confirmed");
      
      // Save to localStorage that we've sent a request to this address
      if (typeof window !== "undefined") {
        const sentRequests = JSON.parse(localStorage.getItem(`sentRequests_${account}`) || "[]");
        if (!sentRequests.includes(address.toLowerCase())) {
          sentRequests.push(address.toLowerCase());
          localStorage.setItem(`sentRequests_${account}`, JSON.stringify(sentRequests));
        }
      }
      
      setIsLoading(false);
      
      // Refresh the page to update UI
      if (typeof window !== "undefined") {
        window.location.reload();
      }

      toast({
        title: "Friend Request Sent!",
        message: "Your friend request has been sent successfully.",
        type: "success",
      });
    } catch (err: any) {
      setIsLoading(false);
      console.error("[handleAddFriend] Error:", err);
      
      // Provide more specific error messages based on the error
      let errorMessage = "Failed to send friend request. Please try again.";
      if (err.message.includes("User is not registered")) {
        errorMessage = "This user is not registered on the platform.";
      } else if (err.message.includes("User is already a friend")) {
        errorMessage = "This user is already in your friends list.";
      } else if (err.message.includes("blocked")) {
        errorMessage = "You cannot add a user that you have blocked or who has blocked you.";
      }
      
      toast({
        title: "Error Adding Friend",
        message: errorMessage,
        type: "error",
      });
    }
  };

  // Check for pending friend requests from other users
  const checkIncomingFriendRequests = async (): Promise<string[]> => {
    if (!account) return [];
    
    try {
      // This could be enhanced in the future with a contract method
      // Currently the contract doesn't store pending requests separately
      
      // For now, we'll look at localstorage from other accounts
      // In a real implementation, this would use contract events or a dedicated data structure
      return [];
    } catch (error) {
      console.error("Error checking incoming friend requests:", error);
      return [];
    }
  };

  const handleBlockUser = async (address: string) => {
    setIsLoading(true);
    try {
      if (!address) return;
      const contract = await connectToSmartContract();
      const newBlockedUser = await contract.blockUser(address);
      await newBlockedUser.wait();
      toast({
        title: "Successfully blocked a user!",
        message: "User has been blocked and won't be able to message you.",
        type: "success",
      });
      setIsLoading(false);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error blocking a user",
        message:
          "There seems to be an error while blocking this user. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async (address: string) => {
    setIsLoading(true);
    try {
      if (!address) return;
      const contract = await connectToSmartContract();
      const unblockedUser = await contract.unblockUser(address);
      await unblockedUser.wait();
      toast({
        title: "Successfully unblocked a user!",
        message: "You can now message the user to start a conversation.",
        type: "success",
      });
      setIsLoading(false);

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error unblocking a user",
        message:
          "There seems to be an error while unblocking this user. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserMessages = async (address: string) => {
    setIsLoading(true);
    try {
      if (!account && !registeredUser) {
        toast({
          title: "Error fetching user data",
          message: "Please create an account to access the application",
          type: "error",
        });
      }
      const contract = await connectToSmartContract();
      const getMessages = await contract.readMessages(address);
      setMessages(getMessages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsername = useCallback(
    async (address: string): Promise<string | undefined> => {
      try {
        if (!account) return;
        const contract = await connectToSmartContract();
        const currentUsername = await contract.getUsername(address);
        return currentUsername;
      } catch (err) {
        return;
      }
    },
    [account]
  );

  const detectChainChange = () => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } else {
      return;
    }
  };

  useEffect(() => {
    checkWalletConnection();
    fetchUserData();
    detectChainChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, currentUser, messages]);

  return (
    <ChatContext.Provider
      value={{
        isLoading,
        checkMetamask,
        username,
        account,
        friendList,
        messages,
        setCurrentUser,
        setMessages,
        currentUser,
        input,
        setInput,
        userList,
        blockedUsers,
        connectWallet,
        createAccount,
        getUserMessages,
        getUsername,
        handleSendMessage,
        handleBlockUser,
        handleUnblockUser,
        handleAddFriend,
        checkIncomingFriendRequests,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
