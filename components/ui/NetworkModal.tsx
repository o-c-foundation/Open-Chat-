"use client";

import { useEffect, useMemo } from "react";
import { FC } from "react";
import {
  polygonTest,
  ethTest,
  binanceChain,
  polyChain,
  sepoliaChain,
} from "@/lib/ChainChange";

import Image from "next/image";
import networks from "@/public/logo";
import Heading from "@/components/common/Heading";

interface ModalProps {
  selectedNetwork: string;
  setSelectedNetwork: React.Dispatch<React.SetStateAction<string>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NetworkModal: FC<ModalProps> = ({
  selectedNetwork,
  setSelectedNetwork,
  setOpenModal,
}) => {
  const options = useMemo(
    () => [
      { network: "Sepolia", image: networks.sepolia },
      { network: "Goerli", image: networks.goerli },
      { network: "BSC", image: networks.bnb },
      { network: "Mumbai", image: networks.mumbai },
      { network: "Polygon", image: networks.polygon },
      { network: "BSC Testnet", image: networks.bsc },
      { network: "Ethereum", image: networks.eth },
      { network: "FTM", image: networks.ftm },
    ],
    []
  );

  async function enableChain() {
    if (selectedNetwork === "BSC") {
      binanceChain();
    } else if (selectedNetwork === "Polygon") {
      polyChain();
    } else if (selectedNetwork === "Ethereum") {
      // ethChain();
      return;
    } else if (selectedNetwork === "Sepolia") {
      sepoliaChain();
    } else if (selectedNetwork === "BSC Testnet") {
      // bscTest();
      return;
    } else if (selectedNetwork === "Goerli") {
      ethTest();
    } else if (selectedNetwork === "Mumbai") {
      polygonTest();
    }
  }

  useEffect(() => {
    enableChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-cyber-black/80 backdrop-blur-md z-50">
      <div className="relative bg-cyber-gradient rounded-xl border border-cyber-blue/30 shadow-cyber p-8 max-w-md w-full max-h-[90vh] overflow-y-auto my-auto mx-4">
        <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-20 rounded-xl"></div>
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyber-blue/20 flex items-center justify-center hover:bg-cyber-blue/40 transition-colors"
          onClick={() => setOpenModal(false)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="relative z-10">
          <Heading size="sm" className="mb-6 text-center text-white">
            Select Network
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {options.map((chain, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 transition-all duration-300"
                onClick={() => {
                  setSelectedNetwork(chain.network);
                  setTimeout(() => setOpenModal(false), 500);
                }}
              >
                <div className={`w-14 h-14 rounded-full ${selectedNetwork === chain.network ? 'bg-cyber-blue/30 border-2 border-cyber-blue' : 'bg-cyber-dark/50 hover:bg-cyber-blue/20'} flex items-center justify-center cursor-pointer transition-all duration-300 group`}>
                  <Image
                    src={chain.image}
                    alt={chain.network}
                    width={35}
                    height={35}
                    className="rounded-full cursor-pointer group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm text-center text-gray-300">{chain.network}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkModal;
