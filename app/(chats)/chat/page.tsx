"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Button from "@/components/common/Button";
import { useChatContext } from "@/context/DappChat.context";
import { MessagesType, FriendListType } from "@/context/ChatTypes";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const name = searchParams.get("name");
  
  const { messages, account, input, setInput, handleSendMessage, getUserMessages, friendList } = useChatContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [approvedSenders, setApprovedSenders] = useState<string[]>([]);
  const [ignoredMessages, setIgnoredMessages] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const fetchChat = async () => {
    if (!address) return;
    setLoading(true);
    await getUserMessages(address);
    setLoading(false);
  };
  
  useEffect(() => {
    if (address) {
      fetchChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load approved senders from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApprovedSenders = localStorage.getItem(`approvedSenders_${account}`);
      if (savedApprovedSenders) {
        setApprovedSenders(JSON.parse(savedApprovedSenders));
      }
      
      const savedIgnoredMessages = localStorage.getItem(`ignoredMessages_${account}`);
      if (savedIgnoredMessages) {
        setIgnoredMessages(JSON.parse(savedIgnoredMessages));
      }
    }
  }, [account]);
  
  const handleSendChat = async () => {
    if (!input || !address) return;
    await handleSendMessage({ content: input, address });
    await getUserMessages(address);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };
  
  const formatDate = (timestamp: number | string) => {
    const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) * 1000 : timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const switchChat = (newAddress: string, newName: string) => {
    router.push(`/chat?address=${newAddress}&name=${newName}`);
    setSidebarOpen(false);
  };
  
  // Check if a sender is approved
  const isSenderApproved = (senderAddress: string): boolean => {
    return approvedSenders.includes(senderAddress.toLowerCase()) || 
           friendList.some(friend => friend.friendkey.toLowerCase() === senderAddress.toLowerCase());
  };

  // Approve a sender
  const approveSender = (senderAddress: string) => {
    const newApprovedSenders = [...approvedSenders, senderAddress.toLowerCase()];
    setApprovedSenders(newApprovedSenders);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`approvedSenders_${account}`, JSON.stringify(newApprovedSenders));
    }
  };

  // Ignore a message
  const ignoreMessage = (messageId: string) => {
    const newIgnoredMessages = [...ignoredMessages, messageId];
    setIgnoredMessages(newIgnoredMessages);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`ignoredMessages_${account}`, JSON.stringify(newIgnoredMessages));
    }
  };

  // Generate a unique ID for a message
  const getMessageId = (message: MessagesType) => {
    return `${message.sender}_${message.timestamp}_${message.content.substring(0, 10)}`;
  };
  
  // Filter out ignored messages
  const filteredMessages = messages.filter(message => 
    !ignoredMessages.includes(getMessageId(message))
  );
  
  return (
    <>
      <Navbar />
      <div className="pt-24 pb-10 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Mobile Toggle Button */}
          <div className="mb-4 md:hidden">
            <Button
              variant="outline"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full"
              label={
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {sidebarOpen ? "Hide Contacts" : "Show Contacts"}
                </span>
              }
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Sidebar - Contacts List */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-80 lg:w-96 flex-shrink-0`}>
              <div className="bg-cyber-gradient rounded-xl overflow-hidden border border-cyber-blue/30 shadow-cyber mb-4 md:mb-0 md:h-[calc(100vh-150px)]">
                <div className="p-4 border-b border-cyber-blue/30 bg-cyber-dark/50">
                  <h2 className="text-xl font-bold text-white">Contacts</h2>
                  <p className="text-xs text-gray-400">People you've chatted with</p>
                </div>
                
                <div className="overflow-y-auto h-[calc(100%-70px)]">
                  {friendList.length === 0 && approvedSenders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="w-16 h-16 mb-4 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <h3 className="text-white font-bold mb-2">No contacts yet</h3>
                      <p className="text-gray-400 text-sm mb-4">Start chatting with someone by their wallet address</p>
                      <Link href="/users">
                        <Button
                          variant="primary"
                          size="sm"
                          label="Find Users"
                        />
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 space-y-1">
                      {/* Show friendList contacts */}
                      {friendList.map((friend: FriendListType) => (
                        <div 
                          key={friend.friendkey}
                          onClick={() => switchChat(friend.friendkey, friend.name)}
                          className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                            friend.friendkey === address 
                              ? 'bg-cyber-blue/30 border-cyber-blue border' 
                              : 'hover:bg-cyber-dark/60'
                          }`}
                        >
                          <div className="relative w-10 h-10 rounded-full bg-cyber-purple flex items-center justify-center overflow-hidden border border-cyber-purple/50">
                            <span className="text-white font-bold">{friend.name.charAt(0)}</span>
                            <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{friend.name}</h3>
                            <p className="text-xs text-gray-400 truncate">
                              {friend.friendkey.slice(0, 6)}...{friend.friendkey.slice(-4)}
                            </p>
                          </div>
                          {friend.friendkey === address && (
                            <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse"></div>
                          )}
                        </div>
                      ))}
                      
                      {/* Show approved senders that aren't in friendList */}
                      {approvedSenders
                        .filter(sender => !friendList.some(friend => friend.friendkey.toLowerCase() === sender.toLowerCase()))
                        .map((senderAddress) => {
                          // Try to get a name from search params if available
                          const senderName = senderAddress === address?.toLowerCase() ? name || "Unknown User" : "User";
                          return (
                            <div 
                              key={senderAddress}
                              onClick={() => switchChat(senderAddress, senderName)}
                              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                                senderAddress === address?.toLowerCase()
                                  ? 'bg-cyber-blue/30 border-cyber-blue border' 
                                  : 'hover:bg-cyber-dark/60'
                              }`}
                            >
                              <div className="relative w-10 h-10 rounded-full bg-cyber-green flex items-center justify-center overflow-hidden border border-cyber-green/50">
                                <span className="text-white font-bold">{senderName.charAt(0)}</span>
                                <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">{senderName}</h3>
                                <p className="text-xs text-gray-400 truncate">
                                  {senderAddress.slice(0, 6)}...{senderAddress.slice(-4)}
                                </p>
                              </div>
                              {senderAddress === address?.toLowerCase() && (
                                <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse"></div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Chat Container */}
            <div className="flex-1">
              <div className="bg-cyber-gradient rounded-xl overflow-hidden border border-cyber-blue/30 shadow-cyber h-[calc(100vh-150px)]">
                {address ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b border-cyber-blue/30 bg-cyber-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-cyber-purple flex items-center justify-center overflow-hidden border-2 border-cyber-purple/50">
                          <span className="text-white font-bold text-lg">{name?.charAt(0)}</span>
                          <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                        </div>
                        <div>
                          <h2 className="text-white font-bold">{name || "Unknown User"}</h2>
                          <p className="text-xs text-gray-400">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                          </p>
                        </div>
                        
                        {!isSenderApproved(address) && (
                          <div className="ml-2 bg-cyber-dark/50 px-2 py-1 rounded-md border border-cyber-yellow/30">
                            <span className="text-xs text-cyber-yellow">Not in contacts</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-10 h-10 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-gray-400">Loading conversation...</p>
                        </div>
                      ) : filteredMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="w-16 h-16 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                          <h3 className="text-white font-bold mb-2">No messages yet</h3>
                          <p className="text-gray-400 text-sm max-w-md mx-auto">
                            Start a conversation by sending a message below. Messages are stored on the blockchain and are end-to-end encrypted.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredMessages.map((msg, index) => {
                            const isFromMe = msg.sender === account;
                            const messageId = getMessageId(msg);
                            const showApprovalBanner = !isFromMe && !isSenderApproved(msg.sender) && address === msg.sender;
                            
                            return (
                              <div key={index} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                                <div className="max-w-[75%]">
                                  {/* Approval Banner for new messagers */}
                                  {showApprovalBanner && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="bg-cyber-dark/80 p-2 mb-2 rounded-lg border border-cyber-yellow/50"
                                    >
                                      <p className="text-xs text-cyber-yellow mb-1">New message from unknown sender</p>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="warning"
                                          size="sm"
                                          onClick={() => ignoreMessage(messageId)}
                                          label="Delete"
                                        />
                                        <Button
                                          variant="success"
                                          size="sm"
                                          onClick={() => approveSender(msg.sender)}
                                          label="Keep"
                                        />
                                      </div>
                                    </motion.div>
                                  )}
                                  
                                  <div className={`rounded-lg p-3 ${
                                    isFromMe ? 'bg-cyber-blue/20 text-white' : 'bg-cyber-dark/70 text-gray-300'
                                  }`}>
                                    <p>{msg.content}</p>
                                    <span className="block text-xs text-right mt-1 opacity-70">
                                      {formatDate(msg.timestamp)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef}></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="p-4 border-t border-cyber-blue/30 bg-cyber-dark/50">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your message..."
                          className="flex-1 p-3 rounded-lg bg-cyber-dark border border-cyber-blue/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50"
                        />
                        <Button
                          variant="primary"
                          onClick={handleSendChat}
                          disabled={!input.trim()}
                          label={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m22 2-7 20-4-9-9-4Z" />
                              <path d="M22 2 11 13" />
                            </svg>
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-20 h-20 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Start a conversation</h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                      Select a contact from the sidebar or find new users to start chatting with.
                    </p>
                    <Link href="/users">
                      <Button
                        variant="primary"
                        label="Find Users"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
