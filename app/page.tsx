"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import Button from "@/components/common/Button";
import { useChatContext } from "@/context/DappChat.context";

export default function HomePage() {
  const { account } = useChatContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-block py-1 px-3 bg-cyber-blue/10 border border-cyber-blue rounded-full">
                <p className="text-cyber-blue text-sm font-medium tracking-wider">TESTNET-ONLY MESSAGING</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Secure <span className="text-cyber-blue">Messaging</span> on the Blockchain
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-xl">
                A truly decentralized chat platform with end-to-end privacy. Using only test networks for your safety.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link href={account ? "/users" : "#"}>
                  <Button 
                    variant="glow"
                    size="lg"
                    onClick={account ? undefined : () => {}}
                    label={
                      <span className="flex items-center gap-2">
                        {account ? "Start Chatting" : "Connect Wallet to Begin"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </span>
                    }
                  />
                </Link>
                <Link href="/tutorials">
                  <Button 
                    variant="outline"
                    size="lg"
                    label="How It Works"
                  />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[400px] md:h-[500px] w-full"
            >
              <div className="absolute inset-0 bg-cyber-gradient rounded-lg border border-cyber-blue/30 shadow-cyber overflow-hidden">
                <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-30"></div>
                
                {/* Chat UI Mockup */}
                <div className="flex flex-col h-full p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-cyber-blue/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyber-purple"></div>
                      <span className="text-white font-medium">CryptoUser_01</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-cyber-blue/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-blue">
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                        </svg>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-cyber-blue/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-blue">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v8"></path>
                          <path d="M8 12h8"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 py-4 space-y-4 overflow-auto">
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-cyber-purple flex-shrink-0"></div>
                      <div className="bg-cyber-gray p-3 rounded-lg rounded-tl-none">
                        <p className="text-white text-sm">Hey! Just sent you the NFT we talked about. Using Sepolia testnet.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 max-w-[80%] ml-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-cyber-blue flex-shrink-0"></div>
                      <div className="bg-cyber-blue/30 p-3 rounded-lg rounded-tr-none">
                        <p className="text-white text-sm">Awesome! Let me check my wallet. Love that we're using testnets!</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-cyber-purple flex-shrink-0"></div>
                      <div className="bg-cyber-gray p-3 rounded-lg rounded-tl-none">
                        <p className="text-white text-sm">Great! Let me know when you see it.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 max-w-[80%] ml-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-cyber-blue flex-shrink-0"></div>
                      <div className="bg-cyber-blue/30 p-3 rounded-lg rounded-tr-none">
                        <p className="text-white text-sm">Got it! The transaction confirmed. Thanks!</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-cyber-blue/20">
                    <div className="flex gap-2">
                      <div className="flex-1 bg-cyber-light p-3 rounded-lg border border-cyber-blue/30">
                        <p className="text-gray-400 text-sm">Type your message...</p>
                      </div>
                      <button className="w-10 h-10 rounded-lg bg-cyber-blue flex items-center justify-center shadow-cyber">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="m22 2-7 20-4-9-9-4Z"></path>
                          <path d="M22 2 11 13"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Use <span className="text-cyber-blue">OpenChat</span>?
            </h2>
            <p className="text-gray-400">
              A new era of digital communication built on blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-cyber-gradient p-6 rounded-lg border border-cyber-blue/20 hover:border-cyber-blue/50 transition-all duration-300 hover:shadow-cyber group"
              >
                <div className="w-12 h-12 rounded-lg bg-cyber-blue/20 flex items-center justify-center mb-4 group-hover:bg-cyber-blue/30 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testnet Safety Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-cyber-gradient rounded-xl p-8 border border-cyber-green/30 shadow-cyber relative overflow-hidden">
            <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-20"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 rounded-full bg-cyber-green/10 flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-green">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Testnet-Only for Your Safety</h3>
                  <p className="text-gray-300">
                    This application is designed to work exclusively with test networks (Sepolia, Goerli, Mumbai) 
                    to ensure you never risk real funds. We automatically detect and prevent connections to 
                    mainnet blockchains, making it a safe environment to experiment with blockchain messaging.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-cyber-gradient p-8 md:p-12">
            <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-20"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Experience Decentralized Messaging?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Connect your wallet and start chatting with your friends in a secure, blockchain-powered environment.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href={account ? "/users" : "#"}>
                  <Button 
                    variant="glow"
                    size="lg"
                    onClick={account ? undefined : () => {}}
                    label={account ? "Start Chatting" : "Connect Wallet"}
                  />
                </Link>
                <Link href="/tutorials">
                  <Button 
                    variant="outline"
                    size="lg"
                    label="Learn More"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Testnet Safe",
    description: "App works only with test networks, ensuring you never spend real cryptocurrency.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-green">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    title: "Decentralized",
    description: "All messages are stored on the blockchain, not on centralized servers.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-blue">
        <rect width="8" height="8" x="2" y="2" rx="1"></rect>
        <path d="M14 2c.24 0 .47.04.69.11"></path>
        <path d="M19.89 2.3c.57.36 1.03.82 1.39 1.39"></path>
        <path d="M22 6.4c.05.2.08.41.08.62"></path>
        <path d="M22 10c0 .24-.04.47-.11.69"></path>
        <path d="M21.7 13.89c-.36.57-.82 1.03-1.39 1.39"></path>
        <path d="M17.6 18c-.2.05-.41.08-.62.08"></path>
        <path d="M14 18c-.24 0-.47-.04-.69-.11"></path>
        <path d="M10.11 21.7c-.57-.36-1.03-.82-1.39-1.39"></path>
        <path d="M6 22c-.24 0-.47-.04-.69-.11"></path>
        <path d="M2.11 19.6C2.04 19.39 2 19.16 2 18.93"></path>
        <path d="M2 14c0-.24.04-.47.11-.69"></path>
        <path d="M2.3 10.11c.36-.57.82-1.03 1.39-1.39"></path>
        <path d="M6.4 2c.2-.05.41-.08.62-.08"></path>
        <path d="M10 2c.24 0 .47.04.69.11"></path>
        <line x1="10" x2="10" y1="6" y2="10"></line>
        <line x1="14" x2="10" y1="10" y2="10"></line>
      </svg>
    ),
  },
  {
    title: "Secure & Private",
    description: "Your messages are secured by blockchain cryptography.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-green">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        <circle cx="12" cy="16" r="1"></circle>
      </svg>
    ),
  },
  {
    title: "Multi-Chain Support",
    description: "Compatible with multiple testnet networks including Sepolia, Goerli, and Mumbai.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-purple">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9 0-1.1.3l-.3.3c-.3.4-.1 1 .3 1.3L8 11l-1.5 4-3.3-1.7c-.4-.2-.9-.1-1.2.3-.3.3-.3.8-.1 1.1L5 20l9-2 4.2 1.2c.5.1 1-.1 1.2-.5l.2-.3c.3-.4.2-.8-.2-1"></path>
        <path d="m14.5 14.5-2.5-2.5"></path>
      </svg>
    ),
  },
  {
    title: "No Central Authority",
    description: "No single entity controls your access or data. True peer-to-peer messaging.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-pink">
        <path d="M19 9h-5v5.5a2.5 2.5 0 0 1-5 0V9H4"></path>
        <path d="M7 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
        <path d="M17 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
        <path d="M12 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
      </svg>
    ),
  },
  {
    title: "Wallet Authentication",
    description: "No passwords needed. Simply connect your crypto wallet to access your account.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-yellow">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="M16 8h.01"></path>
        <path d="M7 12h10"></path>
        <path d="M9 16h6"></path>
      </svg>
    ),
  },
];
