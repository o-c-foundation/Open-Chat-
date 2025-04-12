import Image from "next/image";
import Link from "next/link";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";

const HowItWorks = () => {
  return (
    <div className="mx-auto container flex flex-col justify-center items-center mt-10 pb-20">
      <div className="px-5 flex flex-col items-center">
        <Heading size="default">How OpenChat Works</Heading>
        <Paragraph className="mt-5 px-5 font-extralight text-center max-w-3xl text-black dark:text-white">
          OpenChat is a secure, decentralized messaging platform that operates exclusively on blockchain test networks to ensure your safety.
        </Paragraph>
        <hr className="w-[60%] h-0.5 mx-auto mt-3 bg-neutral-400 border-0 dark:bg-neutral-200" />
      </div>

      {/* Step 1: Connect Wallet */}
      <div className="my-10 max-w-4xl w-full px-4">
        <div className="bg-cyber-gradient rounded-xl p-8 border border-cyber-green/30 shadow-cyber relative overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-cyber-blue/20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-cyber-blue">
              1
            </div>
            <div className="flex-1">
              <Heading size="sm" className="mb-2">Connect Your Wallet</Heading>
              <Paragraph className="text-gray-300">
                Start by connecting your MetaMask wallet to OpenChat. We automatically detect and enforce testnet-only connections, 
                so you never risk real cryptocurrency. We support popular testnets like Sepolia, Goerli, and Mumbai.
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Step 2: Create Account */}
        <div className="bg-cyber-gradient rounded-xl p-8 border border-cyber-green/30 shadow-cyber relative overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-cyber-blue/20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-cyber-blue">
              2
            </div>
            <div className="flex-1">
              <Heading size="sm" className="mb-2">Create Your Profile</Heading>
              <Paragraph className="text-gray-300">
                After connecting your wallet, create your OpenChat profile by choosing a username. Your profile is 
                stored on-chain, meaning you own your identity and data in a truly decentralized manner.
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Step 3: Add Friends */}
        <div className="bg-cyber-gradient rounded-xl p-8 border border-cyber-green/30 shadow-cyber relative overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-cyber-blue/20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-cyber-blue">
              3
            </div>
            <div className="flex-1">
              <Heading size="sm" className="mb-2">Connect With Friends</Heading>
              <Paragraph className="text-gray-300">
                Add friends by their wallet address and assign them a friendly name. Our smart contract manages your 
                contact list securely on the blockchain, giving you full control over your connections.
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Step 4: Chat Securely */}
        <div className="bg-cyber-gradient rounded-xl p-8 border border-cyber-green/30 shadow-cyber relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-cyber-blue/20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-cyber-blue">
              4
            </div>
            <div className="flex-1">
              <Heading size="sm" className="mb-2">Message Securely</Heading>
              <Paragraph className="text-gray-300">
                Exchange messages with your connections directly through the blockchain. Every message is recorded 
                on-chain, creating an immutable and verifiable conversation history that no central authority can alter or delete.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Diagram */}
      <div className="my-10 max-w-4xl w-full px-4">
        <Heading size="sm" className="mb-6 text-center">Technical Architecture</Heading>
        <div className="bg-cyber-dark/40 rounded-xl p-8 border border-cyber-blue/30 shadow-cyber">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-cyber-dark/60 rounded-lg border border-cyber-blue/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-cyber-blue/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-cyber-blue">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-cyber-blue font-semibold mb-2">Frontend</h4>
              <p className="text-sm text-gray-300">Next.js application with React components for responsive UI</p>
            </div>
            <div className="p-4 bg-cyber-dark/60 rounded-lg border border-cyber-blue/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-cyber-blue/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-cyber-blue">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h4 className="text-cyber-blue font-semibold mb-2">Smart Contracts</h4>
              <p className="text-sm text-gray-300">Solidity contracts deployed on multiple testnets for user data and messages</p>
            </div>
            <div className="p-4 bg-cyber-dark/60 rounded-lg border border-cyber-blue/20 flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-cyber-blue/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-cyber-blue">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-cyber-blue font-semibold mb-2">Web3 Integration</h4>
              <p className="text-sm text-gray-300">MetaMask wallet connection with testnet enforcement for secure messaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 