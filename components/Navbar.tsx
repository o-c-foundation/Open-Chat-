"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";

import Heading from "@/components/common/Heading";
import Button from "@/components/common/Button";
import NetworkModal from "@/components/ui/NetworkModal";
import SessionWalletModal from "@/components/ui/SessionWalletModal";
import { Icons } from "@/components/Icons";
import { useChatContext } from "@/context/DappChat.context";
import { navLinks } from "@/helpers/NavLinks";
import { getCurrentChain } from "@/lib/Api";
import { hasSessionWallet, isSessionWalletVerified } from "@/lib/utils";

import OpenChatLogo from "@/public/assets/openchat-logo.png";

const Navbar = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [navbar, setNavbar] = useState<boolean>(false);
  const { connectWallet, getUsername, account, setCurrentUser, checkMetamask } =
    useChatContext();

  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [currentChain, setCurrentChain] = useState<string | undefined>(
    "Set Network"
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openSessionWalletModal, setOpenSessionWalletModal] = useState<boolean>(false);
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const [walletVerified, setWalletVerified] = useState<boolean>(false);

  const fetchAccountUsername = async () => {
    const username = await getUsername(account);
    setCurrentUser(username || "");
  };

  const handleOpenModal = () => {
    setOpenModal(() => !openModal);
  };

  const getNetwork = async () => {
    const currChain = await getCurrentChain();
    setCurrentChain(currChain);
  };

  useEffect(() => {
    getNetwork();
    fetchAccountUsername();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  // Check if user has a session wallet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWallet(hasSessionWallet());
      setWalletVerified(isSessionWalletVerified());
    }
  }, [openSessionWalletModal]);

  // Get wallet status icon
  const getWalletStatusIcon = () => {
    if (!hasWallet) {
      return <Icons.Plus className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-blue" />;
    } else if (!walletVerified) {
      return <Icons.AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-yellow" />;
    } else {
      return <Icons.Check className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />;
    }
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-4 md:px-6 fixed top-0 z-40 bg-cyber-dark border-b border-cyber-blue/30 backdrop-blur-sm">
      <div className="flex items-center justify-between py-3 sm:py-4">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-cyber-blue animate-cyber-pulse">
            <Image
              src={OpenChatLogo}
              alt="OpenChat Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white">
              Open<span className="text-cyber-blue">Chat</span>
            </h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-cyber-blue transition-all duration-300"></div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navLinks.map((item, index) => (
            item.page.startsWith('http') ? (
              // External link
              <a
                key={index}
                href={item.page}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyber-blue transition-colors relative group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
              </a>
            ) : (
              // Internal link
              <Link
                key={index}
                href={item.page}
                className="text-gray-300 hover:text-cyber-blue transition-colors relative group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
              </Link>
            )
          ))}
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3">
          <Button
            onClick={handleOpenModal}
            variant="glow"
            size="sm"
            label={
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
                <span className="text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none">{currentChain ? currentChain : "Set Network"}</span>
              </div>
            }
          />
          
          <Button
            onClick={() => connectWallet()}
            variant="primary"
            size="sm"
            label={
              account ? (
                <span className="text-xs sm:text-sm">{account.slice(0, 4) + ".." + account.slice(-3)}</span>
              ) : checkMetamask ? (
                <span className="text-xs sm:text-sm">Connect</span>
              ) : (
                <Link href="https://metamask.io/download/">
                  <span className="text-xs sm:text-sm">Install MetaMask</span>
                </Link>
              )
            }
          />

          {account && (
            <Button
              onClick={() => setOpenSessionWalletModal(true)}
              variant={walletVerified ? "success" : hasWallet ? "warning" : "secondary"}
              size="icon"
              aria-label="Session Wallet"
              title={walletVerified ? "Session Wallet Active" : hasWallet ? "Session Wallet Needs Funding" : "Create Session Wallet"}
              label={getWalletStatusIcon()}
            />
          )}
          
          <Button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            label={
              currentTheme === "dark" ? (
                <Icons.Sun className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-yellow" />
              ) : (
                <Icons.Moon className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-purple" />
              )
            }
          />
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNavbar(!navbar)}
              aria-label="Toggle menu"
              label={
                navbar ? (
                  <Icons.X className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-red" />
                ) : (
                  <Icons.Menu className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-blue" />
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {navbar && (
        <div className="md:hidden pt-3 pb-4 sm:pt-4 sm:pb-6 border-t border-cyber-blue/20 animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item, index) => (
              item.page.startsWith('http') ? (
                // External link
                <a
                  key={index}
                  href={item.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-cyber-blue py-2 px-3 sm:px-4 transition-colors rounded-md hover:bg-cyber-gray/50 text-sm sm:text-base"
                  onClick={() => setNavbar(false)}
                >
                  {item.label}
                </a>
              ) : (
                // Internal link
                <Link
                  key={index}
                  href={item.page}
                  className="text-gray-300 hover:text-cyber-blue py-2 px-3 sm:px-4 transition-colors rounded-md hover:bg-cyber-gray/50 text-sm sm:text-base"
                  onClick={() => setNavbar(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
      
      {openModal && (
        <NetworkModal
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          setOpenModal={setOpenModal}
        />
      )}

      {openSessionWalletModal && (
        <SessionWalletModal
          setOpenModal={setOpenSessionWalletModal}
          onComplete={() => {
            setHasWallet(hasSessionWallet());
            setWalletVerified(isSessionWalletVerified());
          }}
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
