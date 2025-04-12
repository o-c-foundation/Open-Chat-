import Web3Modal from "web3modal";
import { Signer, ethers, Contract } from "ethers";

import { groupChatABI, sepoliaGroupChatContract } from "@/lib/constants";
import { toast } from "@/components/common/Toast";
import { isTestnet, switchToTestnet } from "@/lib/Api";
import { getSessionSigner, hasSessionWallet, isSessionWalletVerified } from "./utils";

// Define the class without export first
class GroupChatApi {
  /**
   * Connect to the group chat contract using session wallet if available
   * @returns A contract connection
   */
  async connect(): Promise<Contract> {
    try {
      // Try to use session wallet first if it exists and is verified
      if (hasSessionWallet() && isSessionWalletVerified()) {
        const sessionSigner = await getSessionSigner();
        if (sessionSigner) {
          console.log("Using session wallet for group chat");
          const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, sessionSigner);
          return contract;
        }
      }
      
      // Fall back to regular connection
      console.log("Falling back to MetaMask for group chat");
      return connectToGroupChatContract();
    } catch (error) {
      console.error("Error connecting to group chat contract:", error);
      throw error;
    }
  }
  
  /**
   * Create a new group
   * @param name Group name
   * @param description Group description
   * @param isPrivate Whether the group is private
   * @returns The new group ID
   */
  async createGroup(name: string, description: string, isPrivate: boolean): Promise<number> {
    try {
      const contract = await this.connect();
      const tx = await contract.createGroup(name, description, isPrivate);
      const receipt = await tx.wait();
      
      // Find the GroupCreated event to get the group ID
      const event = receipt.events.find((e: any) => e.event === 'GroupCreated');
      if (event && event.args) {
        const groupId = event.args.groupId.toNumber();
        
        toast({
          title: "Group Created",
          message: `Successfully created group "${name}"`,
          type: "success",
        });
        
        return groupId;
      }
      
      throw new Error("Failed to get group ID from transaction");
    } catch (error: any) {
      toast({
        title: "Error Creating Group",
        message: error.message || "Failed to create group",
        type: "error",
      });
      throw error;
    }
  }
  
  /**
   * Get user's groups
   * @param address User address
   * @returns Array of groups
   */
  async getUserGroups(address: string): Promise<any[]> {
    try {
      const contract = await this.connect();
      const groupIds = await contract.getUserGroups(address);
      
      // Get details for each group
      const groups = await Promise.all(
        groupIds.map(async (id: ethers.BigNumber) => {
          const groupId = id.toNumber();
          const groupInfo = await contract.getGroup(groupId);
          
          return {
            id: groupId,
            name: groupInfo.name,
            description: groupInfo.description,
            owner: groupInfo.owner,
            createdAt: new Date(groupInfo.createdAt.toNumber() * 1000),
            isPrivate: groupInfo.isPrivate,
            memberCount: groupInfo.memberCount.toNumber(),
          };
        })
      );
      
      return groups;
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return [];
    }
  }
  
  /**
   * Join a group
   * @param groupId Group ID
   */
  async joinGroup(groupId: number): Promise<void> {
    try {
      const contract = await this.connect();
      const tx = await contract.joinGroup(groupId);
      await tx.wait();
      
      toast({
        title: "Success",
        message: "You've joined the group successfully",
        type: "success",
      });
    } catch (error: any) {
      // Check if the error is because the group is private
      if (error.message.includes("Join request already exists")) {
        toast({
          title: "Join Request Sent",
          message: "This is a private group. Your join request has been sent to the admins.",
          type: "success",
        });
      } else {
        toast({
          title: "Error Joining Group",
          message: error.message || "Failed to join group",
          type: "error",
        });
      }
    }
  }
  
  /**
   * Send a message to a group
   * @param groupId Group ID
   * @param content Message content
   */
  async sendMessage(groupId: number, content: string): Promise<void> {
    try {
      console.log("[sendGroupMessage] Attempting to send message to group", groupId);
      
      // Try to use session wallet directly if available
      if (hasSessionWallet() && isSessionWalletVerified()) {
        console.log("[sendGroupMessage] Session wallet found and verified");
        try {
          const sessionSigner = await getSessionSigner();
          
          if (sessionSigner) {
            console.log("[sendGroupMessage] Session signer created successfully");
            
            // Create contract connection with session wallet
            const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, sessionSigner);
            
            // Get wallet address and check balance
            const walletAddress = await sessionSigner.getAddress();
            console.log("[sendGroupMessage] Session wallet address:", walletAddress);
            
            if (sessionSigner.provider) {
              const balanceWei = await sessionSigner.provider.getBalance(walletAddress);
              const balanceEth = ethers.utils.formatEther(balanceWei);
              console.log("[sendGroupMessage] Session wallet balance before sending:", balanceEth, "ETH");
              
              // Check if balance is too low
              if (parseFloat(balanceEth) < 0.0001) {
                console.warn("[sendGroupMessage] Session wallet balance too low, falling back to MetaMask");
                throw new Error("Session wallet balance too low");
              }
            }
            
            console.log("[sendGroupMessage] Sending message with session wallet...");
            const tx = await contract.sendMessage(groupId, content);
            console.log("[sendGroupMessage] Transaction sent, waiting for confirmation...");
            await tx.wait();
            console.log("[sendGroupMessage] Transaction confirmed!");
            
            // Check balance after sending
            if (sessionSigner.provider) {
              const newBalanceWei = await sessionSigner.provider.getBalance(walletAddress);
              const newBalanceEth = ethers.utils.formatEther(newBalanceWei);
              console.log("[sendGroupMessage] Session wallet balance after sending:", newBalanceEth, "ETH");
            }
            
            // Trigger balance update in other components
            if (typeof window !== "undefined") {
              localStorage.setItem("openchat_transaction_complete", Date.now().toString());
            }
            
            return;
          } else {
            console.warn("[sendGroupMessage] Failed to create session signer");
          }
        } catch (error) {
          console.error("[sendGroupMessage] Error using session wallet:", error);
          console.log("[sendGroupMessage] Falling back to MetaMask...");
        }
      } else {
        console.log("[sendGroupMessage] No session wallet available or not verified");
      }
      
      // Fall back to MetaMask via the API
      console.log("[sendGroupMessage] Using MetaMask fallback");
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, signer);
      
      console.log("[sendGroupMessage] Sending message with MetaMask...");
      const tx = await contract.sendMessage(groupId, content);
      console.log("[sendGroupMessage] Transaction sent, waiting for confirmation...");
      await tx.wait();
      console.log("[sendGroupMessage] Transaction confirmed!");
      return;
      
    } catch (error: any) {
      console.error("[sendGroupMessage] Error sending message:", error);
      toast({
        title: "Error Sending Message",
        message: error.message || "Failed to send message to group",
        type: "error",
      });
      throw error;
    }
  }
  
  /**
   * Get messages in a group
   * @param groupId Group ID
   * @returns Array of messages
   */
  async getGroupMessages(groupId: number): Promise<any[]> {
    console.log("[getGroupMessages] Fetching messages for group", groupId);
    
    try {
      // Try direct approach first for freshest data
      console.log("[getGroupMessages] Trying direct contract connection");
      let provider;
      
      try {
        // Try with custom provider first for reliability
        provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia.core.chainstack.com/47b1c16b020f53e3216cac8977d3462a");
        
        // Try with session wallet if available
        if (hasSessionWallet() && isSessionWalletVerified()) {
          const sessionSigner = await getSessionSigner();
          if (sessionSigner) {
            console.log("[getGroupMessages] Using session wallet for reading messages");
            const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, sessionSigner);
            const messages = await contract.getGroupMessages(groupId);
            console.log("[getGroupMessages] Retrieved", messages.length, "messages via session wallet");
            
            return messages.map((msg: any) => ({
              sender: msg.sender,
              content: msg.content,
              timestamp: new Date(msg.timestamp.toNumber() * 1000),
            }));
          }
        }
        
        // Try with provider directly
        console.log("[getGroupMessages] Using direct provider");
        const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, provider);
        const messages = await contract.getGroupMessages(groupId);
        console.log("[getGroupMessages] Retrieved", messages.length, "messages via direct provider");
        
        return messages.map((msg: any) => ({
          sender: msg.sender,
          content: msg.content,
          timestamp: new Date(msg.timestamp.toNumber() * 1000),
        }));
      } catch (error) {
        console.error("[getGroupMessages] Direct approach failed:", error);
      }
      
      // Fall back to API
      console.log("[getGroupMessages] Falling back to API approach");
      const api = new GroupChatApi();
      const messages = await api.getGroupMessages(groupId);
      console.log("[getGroupMessages] Retrieved", messages.length, "messages via API");
      return messages;
    } catch (error) {
      console.error("[getGroupMessages] All approaches failed:", error);
      return [];
    }
  }
  
  /**
   * Get group details
   * @param groupId Group ID
   * @returns Group details
   */
  async getGroupDetails(groupId: number): Promise<any> {
    try {
      const contract = await this.connect();
      const groupInfo = await contract.getGroup(groupId);
      
      return {
        id: groupId,
        name: groupInfo.name,
        description: groupInfo.description,
        owner: groupInfo.owner,
        createdAt: new Date(groupInfo.createdAt.toNumber() * 1000),
        isPrivate: groupInfo.isPrivate,
        memberCount: groupInfo.memberCount.toNumber(),
      };
    } catch (error) {
      console.error("Error fetching group details:", error);
      throw error;
    }
  }
  
  /**
   * Check if user is a member of a group
   * @param groupId Group ID
   * @param address User address
   * @returns True if member
   */
  async isGroupMember(groupId: number, address: string): Promise<boolean> {
    try {
      const contract = await this.connect();
      const member = await contract.getGroupMember(groupId, address);
      return member.exists;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get user's role in a group
   * @param groupId Group ID
   * @param address User address
   * @returns Role (0=Member, 1=Moderator, 2=Admin)
   */
  async getUserGroupRole(groupId: number, address: string): Promise<number> {
    try {
      const contract = await this.connect();
      const member = await contract.getGroupMember(groupId, address);
      return member.role;
    } catch (error) {
      return -1; // Not a member
    }
  }
  
  /**
   * Accept or reject a join request
   * @param groupId Group ID
   * @param requesterAddress Address of the requester
   * @param accept Whether to accept
   */
  async handleJoinRequest(groupId: number, requesterAddress: string, accept: boolean): Promise<void> {
    try {
      const contract = await this.connect();
      let tx;
      
      if (accept) {
        // Role 0 = MEMBER
        tx = await contract.addMember(groupId, requesterAddress, 0);
      } else {
        tx = await contract.rejectJoinRequest(groupId, requesterAddress);
      }
      
      await tx.wait();
      
      toast({
        title: "Success",
        message: `Join request ${accept ? 'accepted' : 'rejected'}`,
        type: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        message: error.message || `Failed to ${accept ? 'accept' : 'reject'} join request`,
        type: "error",
      });
    }
  }
  
  /**
   * Get pending join requests for a group
   * @param groupId Group ID
   * @returns Array of addresses
   */
  async getPendingJoinRequests(groupId: number): Promise<string[]> {
    try {
      const contract = await this.connect();
      return await contract.getPendingJoinRequests(groupId);
    } catch (error) {
      console.error("Error fetching pending join requests:", error);
      return [];
    }
  }
}

// Export the class
export { GroupChatApi };

/**
 * Connect to the group chat smart contract
 * @returns A Contract instance for the group chat contract
 */
export const connectToGroupChatContract = async (): Promise<Contract> => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    
    // Check if connected to a testnet
    const network = await provider.getNetwork();
    const chainId = '0x' + network.chainId.toString(16);
    
    if (!isTestnet(chainId)) {
      toast({
        title: "Mainnet Detected",
        message: "This app only works with testnets to avoid real fees. Switching to Sepolia...",
        type: "error",
      });
      
      const switched = await switchToTestnet();
      if (!switched) {
        throw new Error("Failed to switch to testnet");
      }
      
      // Re-establish connection after network switch
      return connectToGroupChatContract();
    }
    
    // For now, we only support Sepolia for group chat
    if (chainId !== '0xaa36a7') { // Sepolia testnet
      toast({
        title: "Network Not Supported",
        message: "Group chat is currently only available on Sepolia testnet. Switching networks...",
        type: "error",
      });
      
      await switchToTestnet();
      return connectToGroupChatContract();
    }
    
    const signer = provider.getSigner();
    const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, signer);

    return contract;
  } catch (e) {
    toast({
      title: "Connection Error",
      message: "Failed to connect to the group chat contract. Please make sure you're on Sepolia testnet.",
      type: "error",
    });
    throw new Error("Failed to connect to group chat contract");
  }
};

/**
 * Group chat-specific API functions
 */

// Create a new group
export const createGroup = async (
  name: string, 
  description: string, 
  isPrivate: boolean
): Promise<number> => {
  const api = new GroupChatApi();
  return api.createGroup(name, description, isPrivate);
};

// Get all groups a user is a member of
export const getUserGroups = async (address: string): Promise<any[]> => {
  const api = new GroupChatApi();
  return api.getUserGroups(address);
};

// Join a group
export const joinGroup = async (groupId: number): Promise<void> => {
  const api = new GroupChatApi();
  return api.joinGroup(groupId);
};

// Send a message to a group
export const sendGroupMessage = async (groupId: number, content: string): Promise<void> => {
  try {
    console.log("[sendGroupMessage] Attempting to send message to group", groupId);
    
    // Try to use session wallet directly if available
    if (hasSessionWallet() && isSessionWalletVerified()) {
      console.log("[sendGroupMessage] Session wallet found and verified");
      try {
        const sessionSigner = await getSessionSigner();
        
        if (sessionSigner) {
          console.log("[sendGroupMessage] Session signer created successfully");
          
          // Create contract connection with session wallet
          const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, sessionSigner);
          
          // Get wallet address and check balance
          const walletAddress = await sessionSigner.getAddress();
          console.log("[sendGroupMessage] Session wallet address:", walletAddress);
          
          if (sessionSigner.provider) {
            const balanceWei = await sessionSigner.provider.getBalance(walletAddress);
            const balanceEth = ethers.utils.formatEther(balanceWei);
            console.log("[sendGroupMessage] Session wallet balance before sending:", balanceEth, "ETH");
            
            // Check if balance is too low
            if (parseFloat(balanceEth) < 0.0001) {
              console.warn("[sendGroupMessage] Session wallet balance too low, falling back to MetaMask");
              throw new Error("Session wallet balance too low");
            }
          }
          
          console.log("[sendGroupMessage] Sending message with session wallet...");
          const tx = await contract.sendMessage(groupId, content);
          console.log("[sendGroupMessage] Transaction sent, waiting for confirmation...");
          await tx.wait();
          console.log("[sendGroupMessage] Transaction confirmed!");
          
          // Check balance after sending
          if (sessionSigner.provider) {
            const newBalanceWei = await sessionSigner.provider.getBalance(walletAddress);
            const newBalanceEth = ethers.utils.formatEther(newBalanceWei);
            console.log("[sendGroupMessage] Session wallet balance after sending:", newBalanceEth, "ETH");
          }
          
          // Trigger balance update in other components
          if (typeof window !== "undefined") {
            localStorage.setItem("openchat_transaction_complete", Date.now().toString());
          }
          
          return;
        } else {
          console.warn("[sendGroupMessage] Failed to create session signer");
        }
      } catch (error) {
        console.error("[sendGroupMessage] Error using session wallet:", error);
        console.log("[sendGroupMessage] Falling back to MetaMask...");
      }
    } else {
      console.log("[sendGroupMessage] No session wallet available or not verified");
    }
    
    // Fall back to MetaMask via the API
    console.log("[sendGroupMessage] Using MetaMask fallback");
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, signer);
    
    console.log("[sendGroupMessage] Sending message with MetaMask...");
    const tx = await contract.sendMessage(groupId, content);
    console.log("[sendGroupMessage] Transaction sent, waiting for confirmation...");
    await tx.wait();
    console.log("[sendGroupMessage] Transaction confirmed!");
    return;
    
  } catch (error: any) {
    console.error("[sendGroupMessage] Error sending message:", error);
    toast({
      title: "Error Sending Message",
      message: error.message || "Failed to send message to group",
      type: "error",
    });
    throw error;
  }
};

// Get all messages in a group
export const getGroupMessages = async (groupId: number): Promise<any[]> => {
  console.log("[getGroupMessages] Fetching messages for group", groupId);
  
  try {
    // Try direct approach first for freshest data
    console.log("[getGroupMessages] Trying direct contract connection");
    let provider;
    
    try {
      // Try with custom provider first for reliability
      provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia.core.chainstack.com/47b1c16b020f53e3216cac8977d3462a");
      
      // Try with session wallet if available
      if (hasSessionWallet() && isSessionWalletVerified()) {
        const sessionSigner = await getSessionSigner();
        if (sessionSigner) {
          console.log("[getGroupMessages] Using session wallet for reading messages");
          const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, sessionSigner);
          const messages = await contract.getGroupMessages(groupId);
          console.log("[getGroupMessages] Retrieved", messages.length, "messages via session wallet");
          
          return messages.map((msg: any) => ({
            sender: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.timestamp.toNumber() * 1000),
          }));
        }
      }
      
      // Try with provider directly
      console.log("[getGroupMessages] Using direct provider");
      const contract = new ethers.Contract(sepoliaGroupChatContract, groupChatABI, provider);
      const messages = await contract.getGroupMessages(groupId);
      console.log("[getGroupMessages] Retrieved", messages.length, "messages via direct provider");
      
      return messages.map((msg: any) => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: new Date(msg.timestamp.toNumber() * 1000),
      }));
    } catch (error) {
      console.error("[getGroupMessages] Direct approach failed:", error);
    }
    
    // Fall back to API
    console.log("[getGroupMessages] Falling back to API approach");
    const api = new GroupChatApi();
    const messages = await api.getGroupMessages(groupId);
    console.log("[getGroupMessages] Retrieved", messages.length, "messages via API");
    return messages;
  } catch (error) {
    console.error("[getGroupMessages] All approaches failed:", error);
    return [];
  }
};

// Get group details
export const getGroupDetails = async (groupId: number): Promise<any> => {
  const api = new GroupChatApi();
  return api.getGroupDetails(groupId);
};

// Check if a user is a member of a group
export const isGroupMember = async (groupId: number, address: string): Promise<boolean> => {
  const api = new GroupChatApi();
  return api.isGroupMember(groupId, address);
};

// Get a user's role in a group
export const getUserGroupRole = async (groupId: number, address: string): Promise<number> => {
  const api = new GroupChatApi();
  return api.getUserGroupRole(groupId, address);
};

// Handle join requests
export const handleJoinRequest = async (
  groupId: number, 
  requesterAddress: string, 
  accept: boolean
): Promise<void> => {
  const api = new GroupChatApi();
  return api.handleJoinRequest(groupId, requesterAddress, accept);
};

// Get pending join requests
export const getPendingJoinRequests = async (groupId: number): Promise<string[]> => {
  const api = new GroupChatApi();
  return api.getPendingJoinRequests(groupId);
};

// Create direct export for the class itself
// export default GroupChatApi; // Remove duplicate export at the bottom 