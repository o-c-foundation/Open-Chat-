"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import Button from "@/components/common/Button";
import Navbar from "@/components/Navbar";
import { useChatContext } from "@/context/DappChat.context";
import { UserList, FriendListType } from "@/context/ChatTypes";

export default function UserPage() {
  const { userList, friendList, account, handleAddFriend, handleBlockUser, createAccount } = useChatContext();
  const [name, setName] = useState<string>("");
  const [addFriendName, setAddFriendName] = useState<string>("");
  const [addFriendAddress, setAddFriendAddress] = useState<string>("");
  const [showAddFriendModal, setShowAddFriendModal] = useState<boolean>(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [showRequestSent, setShowRequestSent] = useState<boolean>(false);
  
  // Get URL search params to check if we're coming from the chat
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const addAddress = urlParams?.get("addAddress");
  const addName = urlParams?.get("addName");

  useEffect(() => {
    // If we have addAddress and addName in URL params (from chat), open add friend modal
    if (addAddress && addName && mounted) {
      setAddFriendAddress(addAddress);
      setAddFriendName(addName);
      setShowAddFriendModal(true);
    }
  }, [addAddress, addName, mounted]);
  
  useEffect(() => {
    setMounted(true);
    // Load sent requests from localStorage
    if (typeof window !== "undefined") {
      const savedRequests = localStorage.getItem(`sentRequests_${account}`);
      if (savedRequests) {
        setSentRequests(JSON.parse(savedRequests));
      }
    }
  }, [account]);

  if (!mounted) return null;

  const isFriend = (address: string): boolean => {
    return friendList.some((friend: FriendListType) => friend.friendkey.toLowerCase() === address.toLowerCase());
  };
  
  const hasSentRequest = (address: string): boolean => {
    return sentRequests.includes(address.toLowerCase());
  };

  const handleCreateUser = async () => {
    if (!name) return;
    await createAccount({ name });
    setShowCreateUserModal(false);
  };

  const handleAddFriendAction = async () => {
    if (!addFriendName || !addFriendAddress) return;
    
    // Store this request in local state to show "Request Sent" UI
    const newSentRequests = [...sentRequests, addFriendAddress.toLowerCase()];
    setSentRequests(newSentRequests);
    
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem(`sentRequests_${account}`, JSON.stringify(newSentRequests));
    }
    
    // Still call the actual addFriend function from the contract
    await handleAddFriend({ name: addFriendName, address: addFriendAddress });
    setShowAddFriendModal(false);
    setAddFriendName("");
    setAddFriendAddress("");
    
    // Show success message
    setShowRequestSent(true);
    setTimeout(() => setShowRequestSent(false), 3000);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Request sent notification */}
            {showRequestSent && (
              <div className="fixed top-24 right-4 bg-cyber-gradient rounded-lg border border-cyber-blue/30 p-4 shadow-cyber z-50 max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyber-blue/20 flex items-center justify-center text-cyber-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Friend Request Sent!</h3>
                    <p className="text-xs text-gray-300">They'll receive your request in their message requests.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {friendList.length ? "Discover People" : "Discover People"}
                </h1>
                <p className="text-gray-400 mt-1">
                  {friendList.length 
                    ? `Connected with ${friendList.length} ${friendList.length === 1 ? "person" : "people"} on the blockchain`
                    : "Find and connect with friends for secure, blockchain-verified conversations"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => setShowAddFriendModal(true)}
                  className="bg-cyber-blue hover:bg-cyber-blue/80 shadow-lg px-5 py-2.5 rounded-full"
                  label={
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      Search For Friends
                    </span>
                  }
                />
              </div>
            </div>

            {/* Friends List Section */}
            {friendList.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-blue">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Your Friends
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friendList.map((friend: FriendListType, index: number) => (
                    <motion.div
                      key={friend.friendkey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-cyber-gradient rounded-lg border border-cyber-blue/30 overflow-hidden hover:shadow-cyber transition-shadow duration-300"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full bg-cyber-blue overflow-hidden border-2 border-cyber-blue/50 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">{friend.name.charAt(0)}</span>
                              <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{friend.name}</h3>
                              <p className="text-xs text-gray-400">
                                {friend.friendkey.slice(0, 6)}...{friend.friendkey.slice(-4)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => handleBlockUser(friend.friendkey)}
                              className="p-1.5 rounded-full bg-cyber-gray hover:bg-cyber-red/20 text-gray-400 hover:text-cyber-red transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m4.9 4.9 14.2 14.2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <Link href={`/chat?address=${friend.friendkey}&name=${friend.name}`}>
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            label={
                              <span className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Message
                              </span>
                            }
                          />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Available Users Section */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-purple">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                People to Discover
              </h2>
              
              {userList.length === 0 ? (
                <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyber-purple/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-purple">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No users found</h3>
                  <p className="text-gray-400 mb-4">Be the first to create an account on this network!</p>
                  <Button 
                    variant="glow" 
                    label="Create Your Account" 
                    onClick={() => setShowCreateUserModal(true)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userList
                    .filter((user: UserList) => user.accountAddress.toLowerCase() !== account.toLowerCase())
                    .filter((user: UserList) => !isFriend(user.accountAddress))
                    .map((user: UserList, index: number) => (
                      <motion.div
                        key={user.accountAddress}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-cyber-gradient rounded-lg border border-cyber-purple/30 overflow-hidden hover:shadow-cyber transition-shadow duration-300"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-full bg-cyber-purple overflow-hidden border-2 border-cyber-purple/50 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">{user.name.charAt(0)}</span>
                                <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                                <p className="text-xs text-gray-400">
                                  {user.accountAddress.slice(0, 6)}...{user.accountAddress.slice(-4)}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant={hasSentRequest(user.accountAddress) ? "outline" : "secondary"}
                            className={`w-full ${hasSentRequest(user.accountAddress) ? "border-cyber-yellow text-cyber-yellow" : ""}`}
                            onClick={() => {
                              if (!hasSentRequest(user.accountAddress)) {
                                setAddFriendName(user.name);
                                setAddFriendAddress(user.accountAddress);
                                setShowAddFriendModal(true);
                              }
                            }}
                            label={
                              <span className="flex items-center justify-center gap-2">
                                {hasSentRequest(user.accountAddress) ? (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    Request Sent
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="9" cy="7" r="4"></circle>
                                      <line x1="19" x2="19" y1="8" y2="14"></line>
                                      <line x1="22" x2="16" y1="11" y2="11"></line>
                                    </svg>
                                    Send Request
                                  </>
                                )}
                              </span>
                            }
                          />
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="bg-cyber-gradient rounded-xl border border-cyber-blue/30 shadow-cyber p-6 max-w-md w-full relative"
          >
            <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-10 rounded-xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Send Friend Request</h3>
                <button 
                  onClick={() => setShowAddFriendModal(false)}
                  className="w-8 h-8 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 flex items-center justify-center text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="friendName" className="block text-sm font-medium text-gray-300 mb-1">Friend's Name</label>
                  <input
                    id="friendName"
                    type="text"
                    value={addFriendName}
                    onChange={(e) => setAddFriendName(e.target.value)}
                    placeholder="Enter friend's name"
                    className="w-full p-3 rounded-lg bg-cyber-dark border border-cyber-blue/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="friendAddress" className="block text-sm font-medium text-gray-300 mb-1">Wallet Address</label>
                  <input
                    id="friendAddress"
                    type="text"
                    value={addFriendAddress}
                    onChange={(e) => setAddFriendAddress(e.target.value)}
                    placeholder="Enter wallet address (0x...)"
                    className="w-full p-3 rounded-lg bg-cyber-dark border border-cyber-blue/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50"
                  />
                </div>
                
                <div className="p-3 rounded-lg bg-cyber-dark/80 border border-cyber-yellow/20">
                  <p className="text-xs text-gray-300">
                    <span className="text-cyber-yellow font-bold">Note:</span> They'll receive your request in their message requests and can accept by adding you back.
                  </p>
                </div>
                
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  onClick={handleAddFriendAction}
                  label="Send Friend Request"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="bg-cyber-gradient rounded-xl border border-cyber-blue/30 shadow-cyber p-6 max-w-md w-full relative"
          >
            <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-10 rounded-xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Create Your Account</h3>
                <button 
                  onClick={() => setShowCreateUserModal(false)}
                  className="w-8 h-8 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 flex items-center justify-center text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Your Username</label>
                  <input
                    id="username"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full p-3 rounded-lg bg-cyber-dark border border-cyber-blue/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50"
                  />
                </div>
                
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  onClick={handleCreateUser}
                  label="Create Account"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
