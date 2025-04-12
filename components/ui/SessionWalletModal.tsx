"use client";
import { useState, FC, SetStateAction, useEffect } from "react";
import { ethers } from "ethers";

import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import Heading from "@/components/common/Heading";
import { toast } from "@/components/common/Toast";

import { 
  generateSessionWallet, 
  saveSessionWallet, 
  getSessionWallet, 
  markSessionWalletVerified,
  hasSessionWallet,
  isSessionWalletVerified
} from "@/lib/utils";

interface ModalProps {
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  onComplete?: () => void;
}

const SessionWalletModal: FC<ModalProps> = ({ setOpenModal, onComplete }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionWallet, setSessionWallet] = useState<ethers.Wallet | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [step, setStep] = useState<'create' | 'fund' | 'complete'>('create');

  // Check if session wallet already exists
  useEffect(() => {
    const wallet = getSessionWallet();
    if (wallet) {
      setSessionWallet(wallet);
      if (isSessionWalletVerified()) {
        setStep('complete');
      } else {
        setStep('fund');
      }
      // Immediately check the balance
      checkWalletBalance(wallet);
    }
  }, []);

  // Force balance update at regular intervals whenever modal is open
  useEffect(() => {
    if (sessionWallet) {
      // Check balance immediately
      checkWalletBalance(sessionWallet);
      
      // Then set up a polling interval
      const intervalId = setInterval(() => {
        checkWalletBalance(sessionWallet);
      }, 5000); // Every 5 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [sessionWallet, step]);

  // Check wallet balance using multiple approaches
  const checkWalletBalance = async (wallet: ethers.Wallet) => {
    if (!wallet) return;
    
    try {
      setIsLoading(true);
      
      // Use custom RPC provider
      const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia.core.chainstack.com/47b1c16b020f53e3216cac8977d3462a");
      
      try {
        const walletWithProvider = wallet.connect(provider);
        const walletAddress = await walletWithProvider.getAddress();
        console.log("Checking balance for session wallet:", walletAddress);
        
        const balanceWei = await provider.getBalance(walletAddress);
        const balanceEth = ethers.utils.formatEther(balanceWei);
        console.log("Session wallet balance:", balanceEth, "ETH");
        
        setBalance(balanceEth);
        
        // If balance > 0, mark as verified
        if (parseFloat(balanceEth) > 0) {
          markSessionWalletVerified();
          setStep('complete');
        }
      } catch (err) {
        console.error("Error checking balance with provider:", err);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error in checkWalletBalance:", error);
      setIsLoading(false);
    }
  };

  // Generate new session wallet
  const handleCreateWallet = () => {
    try {
      setIsLoading(true);
      const wallet = generateSessionWallet();
      setSessionWallet(wallet);
      saveSessionWallet(wallet);
      setStep('fund');
      checkWalletBalance(wallet);
      setIsLoading(false);
      
      toast({
        title: "Wallet Created",
        message: "Your OpenChat session wallet has been created",
        type: "success",
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      setIsLoading(false);
      
      toast({
        title: "Error",
        message: "Failed to create session wallet",
        type: "error",
      });
    }
  };

  // Handle completion
  const handleComplete = () => {
    if (onComplete) onComplete();
    setOpenModal(false);
  };

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      message: "Address copied to clipboard",
      type: "success",
    });
  };

  // Refresh balance with user feedback
  const refreshBalance = () => {
    if (sessionWallet) {
      toast({
        title: "Refreshing Balance",
        message: "Checking your wallet balance...",
        type: "success",
      });
      
      // Set loading state to show visual feedback
      setIsLoading(true);
      
      // Slight delay to ensure transaction has time to be processed
      setTimeout(() => {
        checkWalletBalance(sessionWallet);
      }, 2000);
    }
  };

  // Listen for storage events to update balance across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "openchat_transaction_complete" && sessionWallet) {
        console.log("Transaction detected, refreshing balance...");
        setTimeout(() => checkWalletBalance(sessionWallet), 2000);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [sessionWallet]);

  return (
    <div className="fixed backdrop-blur-sm inset-0 flex items-center justify-center bg-black/70 z-[9999] p-4 overflow-y-auto" style={{ height: '100vh', paddingTop: '10vh', paddingBottom: '10vh' }}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-cyber-gradient border border-cyber-blue/30 shadow-cyber text-white rounded-lg p-6 sm:p-8 mx-4 sm:mx-auto w-full max-w-md max-h-[80vh] overflow-y-auto">
          <Heading size="sm" className="text-2xl font-bold mb-4">
            {step === 'create' ? 'Create Session Wallet' : 
             step === 'fund' ? 'Fund Your Session Wallet' : 
             'Your Session Wallet'}
          </Heading>
          
          {step === 'create' && (
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Create a dedicated OpenChat wallet that will auto-sign your messages. 
                This improves your experience by not requiring a signature for every message you send.
              </p>
              <div className="flex justify-end mt-6">
                <Button
                  className="px-4 py-2 text-sm font-medium bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-blue/30 rounded-md mr-2"
                  onClick={() => setOpenModal(false)}
                  label="Cancel"
                />
                <Button
                  className="px-4 py-2 text-sm font-medium bg-cyber-blue hover:bg-cyber-blue/80 text-white rounded-md"
                  onClick={handleCreateWallet}
                  label="Create Wallet"
                />
              </div>
            </div>
          )}
          
          {step === 'fund' && sessionWallet && (
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                To use your session wallet, you need to send a small amount of Sepolia ETH to it. 
                This ETH will be used for transaction fees when sending messages.
              </p>
              
              <div className="bg-cyber-dark/40 border border-cyber-blue/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Wallet Address:</span>
                  <button 
                    onClick={() => copyToClipboard(sessionWallet.address)}
                    className="text-xs bg-cyber-blue/20 hover:bg-cyber-blue/30 px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                </div>
                <div className="text-sm font-mono break-all">
                  {sessionWallet.address}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-gray-400 text-sm">Balance:</span>
                    <div className="font-medium">{balance} ETH</div>
                  </div>
                  <button 
                    onClick={refreshBalance}
                    disabled={isLoading}
                    className={`text-xs ${isLoading ? 'bg-gray-500' : 'bg-cyber-blue/20 hover:bg-cyber-blue/30'} px-2 py-1 rounded flex items-center`}
                  >
                    {isLoading ? 'Checking...' : 'Refresh'}
                    {isLoading && (
                      <svg className="animate-spin ml-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-6">
                After sending ETH to your session wallet, click 'Refresh' to check your balance.
                Once your balance is updated, you can continue.
              </p>
              
              <div className="flex justify-end">
                <Button
                  className="px-4 py-2 text-sm font-medium bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-blue/30 rounded-md mr-2"
                  onClick={() => setOpenModal(false)}
                  label="Close"
                />
                <Button
                  className="px-4 py-2 text-sm font-medium bg-cyber-blue hover:bg-cyber-blue/80 text-white rounded-md"
                  disabled={parseFloat(balance) <= 0}
                  onClick={() => {
                    markSessionWalletVerified();
                    setStep('complete');
                  }}
                  label="Continue"
                />
              </div>
            </div>
          )}
          
          {step === 'complete' && sessionWallet && (
            <div className="mb-6">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Your session wallet is ready to use!</span>
              </div>
              
              <div className="bg-cyber-dark/40 border border-cyber-blue/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Wallet Address:</span>
                  <button 
                    onClick={() => copyToClipboard(sessionWallet.address)}
                    className="text-xs bg-cyber-blue/20 hover:bg-cyber-blue/30 px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                </div>
                <div className="text-sm font-mono break-all">
                  {sessionWallet.address}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-gray-400 text-sm">Balance:</span>
                    <div className="font-medium">{balance} ETH</div>
                  </div>
                  <button 
                    onClick={refreshBalance}
                    disabled={isLoading}
                    className={`text-xs ${isLoading ? 'bg-gray-500' : 'bg-cyber-blue/20 hover:bg-cyber-blue/30'} px-2 py-1 rounded flex items-center`}
                  >
                    {isLoading ? 'Checking...' : 'Refresh'}
                    {isLoading && (
                      <svg className="animate-spin ml-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mb-6">
                You can now enjoy smoother messaging without having to approve each transaction.
                Your messages will be auto-signed using this session wallet.
              </p>
              
              <div className="flex justify-end">
                <Button
                  className="px-4 py-2 text-sm font-medium bg-cyber-blue hover:bg-cyber-blue/80 text-white rounded-md"
                  onClick={handleComplete}
                  label="Done"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionWalletModal; 