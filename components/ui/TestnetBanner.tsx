"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TestnetBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  // Check if user has already agreed in this session
  useEffect(() => {
    const sessionAgreement = sessionStorage.getItem("testnet-agreement");
    if (sessionAgreement === "true") {
      setHasAgreed(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleAgree = () => {
    sessionStorage.setItem("testnet-agreement", "true");
    setHasAgreed(true);
    setIsVisible(false);
  };

  if (!isVisible || hasAgreed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-cyber-gradient border border-cyber-blue/50 rounded-lg shadow-cyber w-full max-w-sm sm:max-w-md md:max-w-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-cyber-blue/20 rounded-full">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-cyber-blue sm:w-6 sm:h-6 md:w-7 md:h-7"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold text-center text-white mb-3 sm:mb-4">Testnet-Only Environment Disclosure</h2>
            
            <div className="bg-cyber-dark/50 border border-cyber-blue/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base">
              <p className="text-gray-300 mb-2 sm:mb-3">
                <strong>Important:</strong> This application operates exclusively on blockchain testnets for your safety.
              </p>
              <ul className="text-gray-300 space-y-1 sm:space-y-2 list-disc pl-5 mb-2 sm:mb-3">
                <li><strong>No real funds</strong> are required or at risk when using this application.</li>
                <li>All messages and data are stored on <strong>public test blockchains</strong> and are visible to anyone.</li>
                <li>While using test networks, your <strong>messages are real</strong> and will be stored permanently on the blockchain.</li>
                <li>Do not share sensitive or private information through this platform.</li>
              </ul>
              <p className="text-gray-300">
                By clicking "I Understand & Agree" below, you acknowledge these conditions and consent to using the application.
              </p>
            </div>
            
            <div className="flex flex-col xs:flex-row justify-center gap-3 xs:space-x-4">
              <Link
                href="https://opencryptofoundation.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full xs:w-auto text-center px-4 py-2 bg-transparent border border-cyber-blue/50 hover:bg-cyber-blue/10 text-cyber-blue rounded-md transition-colors text-sm sm:text-base"
              >
                Learn More
              </Link>
              <button
                onClick={handleAgree}
                className="w-full xs:w-auto text-center px-4 py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white rounded-md transition-colors text-sm sm:text-base"
              >
                I Understand & Agree
              </button>
            </div>
            
            <div className="mt-4 sm:mt-6 text-center text-xs text-gray-400">
              Brought to you by{" "}
              <Link 
                href="https://opencryptofoundation.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-blue hover:underline"
              >
                The Open Crypto Foundation
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestnetBanner; 