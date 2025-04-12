import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ethers } from "ethers";
import { toast } from "@/components/common/Toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Wallet storage keys
const SESSION_WALLET_KEY = "openchat_session_wallet";
const SESSION_WALLET_VERIFIED_KEY = "openchat_session_verified";

/**
 * Generate a new session wallet
 * @returns The new wallet object
 */
export const generateSessionWallet = (): ethers.Wallet => {
  // Create a random wallet
  const wallet = ethers.Wallet.createRandom();
  return wallet;
};

/**
 * Save the session wallet to localStorage
 * @param wallet The wallet to save
 */
export const saveSessionWallet = (wallet: ethers.Wallet): void => {
  if (typeof window !== "undefined") {
    // Store private key only - we'll recreate the wallet when needed
    localStorage.setItem(SESSION_WALLET_KEY, wallet.privateKey);
  }
};

/**
 * Get the session wallet from localStorage
 * @returns The session wallet or null if not found
 */
export const getSessionWallet = (): ethers.Wallet | null => {
  if (typeof window === "undefined") return null;
  
  const privateKey = localStorage.getItem(SESSION_WALLET_KEY);
  if (!privateKey) return null;
  
  try {
    // Recreate the wallet from the private key
    return new ethers.Wallet(privateKey);
  } catch (error) {
    console.error("Error loading session wallet:", error);
    return null;
  }
};

/**
 * Check if the user has a session wallet
 * @returns True if the user has a session wallet
 */
export const hasSessionWallet = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_WALLET_KEY) !== null;
};

/**
 * Mark the session wallet as verified (funded and ready to use)
 */
export const markSessionWalletVerified = (): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_WALLET_VERIFIED_KEY, "true");
  }
};

/**
 * Check if the session wallet is verified
 * @returns True if the session wallet is verified
 */
export const isSessionWalletVerified = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_WALLET_VERIFIED_KEY) === "true";
};

/**
 * Clear the session wallet from localStorage
 */
export const clearSessionWallet = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_WALLET_KEY);
    localStorage.removeItem(SESSION_WALLET_VERIFIED_KEY);
  }
};

/**
 * Get a provider for the current network
 * @returns A JSON RPC provider
 */
export const getProvider = async (): Promise<ethers.providers.JsonRpcProvider> => {
  // For Sepolia, always use our custom Chainstack endpoint for reliability
  const customSepoliaRpc = "https://ethereum-sepolia.core.chainstack.com/47b1c16b020f53e3216cac8977d3462a";
  
  try {
    // Check current network from metamask if available
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      
      // Use appropriate RPC URL based on chain
      if (chainId === "0xaa36a7") { // Sepolia
        return new ethers.providers.JsonRpcProvider(customSepoliaRpc);
      } else if (chainId === "0x5") { // Goerli
        return new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
      } else if (chainId === "0x13881") { // Mumbai
        return new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
      } else if (chainId === "0x61") { // BSC Testnet
        return new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
      }
    }
  } catch (error) {
    console.log("Error detecting network, using default Sepolia", error);
  }
  
  // Default to Sepolia
  return new ethers.providers.JsonRpcProvider(customSepoliaRpc);
};

/**
 * Create a signer from the session wallet
 * @returns A signer connected to the provider
 */
export const getSessionSigner = async (): Promise<ethers.Signer | null> => {
  const wallet = getSessionWallet();
  if (!wallet) return null;
  
  const provider = await getProvider();
  return wallet.connect(provider);
};
