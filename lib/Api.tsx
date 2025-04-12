import Web3Modal from "web3modal";
import { Signer, ethers, Contract } from "ethers";
import BigNumber from "bignumber.js";
import detectEthereumProvider from "@metamask/detect-provider";

import { contractABI } from "@/lib/constants";

import { toast } from "@/components/common/Toast";
import {
  hhContract,
  goerliContract,
  mumbaiContract,
  bscContract,
  bnbContract,
  polygonContract,
  sepoliaContract,
} from "@/lib/constants";
import { getSessionSigner, hasSessionWallet, isSessionWalletVerified } from "./utils";

let contractAdd: string;

// Define testnet and mainnet chain IDs
export const TESTNETS = {
  HARDHAT: "0x7a69",       // Hardhat local testnet
  GOERLI: "0x5",           // Ethereum Goerli testnet
  MUMBAI: "0x13881",       // Polygon Mumbai testnet 
  BSC_TESTNET: "0x61",     // BSC Testnet
  SEPOLIA: "0xaa36a7",     // Ethereum Sepolia testnet
};

const MAINNETS = {
  ETHEREUM: "0x1",         // Ethereum Mainnet
  BSC: "0x38",             // Binance Smart Chain Mainnet
  POLYGON: "0x89",         // Polygon Mainnet
  FANTOM: "0xfa",          // Fantom Mainnet
  AVALANCHE: "0xa86a",     // Avalanche Mainnet
};

// Check if a network is a testnet
export const isTestnet = (chainId: string): boolean => {
  return Object.values(TESTNETS).includes(chainId);
};

// Function to get the current chain
export const getCurrentChain = async () => {
  let chain;
  
  const provider = (await detectEthereumProvider()) as any;
  if (!provider) return;
  const chainId = await provider.request({ method: "eth_chainId" });
  if (!chainId) return;

  if (chainId === TESTNETS.HARDHAT) {
    chain = "Hardhat";
  } else if (chainId === TESTNETS.GOERLI) {
    chain = "Goerli";
  } else if (chainId === TESTNETS.MUMBAI) {
    chain = "Mumbai";
  } else if (chainId === TESTNETS.BSC_TESTNET) {
    chain = "BSC Testnet";
  } else if (chainId === TESTNETS.SEPOLIA) {
    chain = "Sepolia";
  } else if (chainId === MAINNETS.ETHEREUM) {
    chain = "Ethereum Mainnet (Not Supported)";
  } else if (chainId === MAINNETS.BSC) {
    chain = "BSC Mainnet (Not Supported)";
  } else if (chainId === MAINNETS.POLYGON) {
    chain = "Polygon Mainnet (Not Supported)";
  } else if (chainId === MAINNETS.FANTOM) {
    chain = "Fantom Mainnet (Not Supported)";
  } else if (chainId === MAINNETS.AVALANCHE) {
    chain = "Avalanche Mainnet (Not Supported)";
  } else {
    chain = "Unknown Network";
  }
  
  return chain;
};

// Function to switch network to a supported testnet
export const switchToTestnet = async (): Promise<boolean | undefined> => {
  const provider = (await detectEthereumProvider()) as any;
  
  if (!provider) {
    toast({
      title: "Metamask Error",
      message: "Please install Metamask",
      type: "error",
    });
    return;
  }
  
  try {
    // Try to switch to Sepolia testnet
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: TESTNETS.SEPOLIA }],
    });
    return true;
  } catch (switchError: any) {
    // If the chain is not added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add Sepolia to MetaMask
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: TESTNETS.SEPOLIA,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'SEP',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            },
          ],
        });
        return true;
      } catch (addError) {
        toast({
          title: "Network Error",
          message: "Failed to add Sepolia testnet.",
          type: "error",
        });
      }
    } else {
      toast({
        title: "Network Error",
        message: "Failed to switch network.",
        type: "error",
      });
    }
  }
  return false;
};

export const setSmartContract = async (): Promise<string> => {
  const provider = (await detectEthereumProvider()) as any;

  if (!provider) {
    toast({
      title: "Metamask Error",
      message: "Please install Metamask",
      type: "error",
    });
    return "";
  }
  
  const chainId = await provider.request({ method: "eth_chainId" });
  if (!chainId) {
    toast({
      title: "Network Error",
      message: "Please change your network",
      type: "error",
    });
    return "";
  }

  // Check if current network is a mainnet
  if (!isTestnet(chainId)) {
    toast({
      title: "Mainnet Detected",
      message: "This app only works with testnets to avoid real fees. Please switch to a testnet.",
      type: "error",
    });
    return "";
  }

  if (chainId === TESTNETS.HARDHAT) {
    contractAdd = hhContract;
  } else if (chainId === TESTNETS.GOERLI) {
    contractAdd = goerliContract;
  } else if (chainId === TESTNETS.MUMBAI) {
    contractAdd = mumbaiContract;
  } else if (chainId === TESTNETS.BSC_TESTNET) {
    contractAdd = bscContract;
  } else if (chainId === TESTNETS.SEPOLIA) {
    contractAdd = sepoliaContract;
  } else {
    toast({
      title: "Unsupported Network",
      message: "Please connect to Sepolia, Goerli, Mumbai or BSC Testnet.",
      type: "error",
    });
    return "";
  }
  
  return contractAdd;
};

export const fetchContract = async (signer: Signer): Promise<Contract> => {
  const multiChainContract = await setSmartContract();
  if (!multiChainContract) {
    throw new Error("No contract address available for this network");
  }
  return new ethers.Contract(multiChainContract, contractABI, signer);
};

export const connectToSmartContract = async (): Promise<Contract> => {
  try {
    // Try to use the session wallet if it exists and is verified
    if (hasSessionWallet() && isSessionWalletVerified()) {
      const sessionSigner = await getSessionSigner();
      if (sessionSigner) {
        // Ensure contract address is set before using it
        await setSmartContract();
        const contract = await fetchContract(sessionSigner);
        return contract;
      }
    }
    
    // Fall back to MetaMask if no session wallet
    const web3modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: {}
    });
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
      return connectToSmartContract();
    }
    
    const signer = provider.getSigner();
    const contract = await fetchContract(signer);

    return contract;
  } catch (e) {
    console.error("Error connecting to smart contract:", e);
    toast({
      title: "Connection Error",
      message: "Failed to connect to the blockchain. Please make sure you're on a testnet.",
      type: "error",
    });
    throw new Error("No ethereum object or unsupported network");
  }
};

export const formattedTime = (time: string | number | BigNumber) => {
  const timestamp = new BigNumber(time);

  if (timestamp.isNaN()) {
    return undefined;
  }

  const date = timestamp.toNumber() * 1000;
  const newTime = new Date(date);
  const today = new Date();

  const formattedDate = newTime.toLocaleDateString();
  const formattedTime = newTime.toLocaleTimeString().slice(0, -6);

  if (today.toLocaleDateString() === formattedDate) {
    return `Today, ${formattedTime} ${newTime.getHours() >= 12 ? "PM" : "AM"}`;
  } else {
    return `${formattedDate}, ${formattedTime} ${
      newTime.getHours() >= 12 ? "PM" : "AM"
    }`;
  }
};
