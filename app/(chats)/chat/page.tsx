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
  const [activeTab, setActiveTab] = useState<"inbox" | "requests">("inbox");
  
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
  
  // Check if the current chat address is in the friends list
  const isInFriendsList = friendList.some(
    (friend) => friend.friendkey.toLowerCase() === address?.toLowerCase()
  );

  // Filter messages based on the active tab
  const filteredMessages = messages.filter((message) => {
    if (activeTab === "inbox") {
      return isInFriendsList || message.sender === account;
    } else {
      return !isInFriendsList && message.sender !== account;
    }
  });
  
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
            {/* Sidebar - Friends List */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-80 lg:w-96 flex-shrink-0`}>
              <div className="bg-cyber-gradient rounded-xl overflow-hidden border border-cyber-blue/30 shadow-cyber mb-4 md:mb-0 md:h-[calc(100vh-150px)]">
                <div className="p-4 border-b border-cyber-blue/30 bg-cyber-dark/50">
                  <h2 className="text-xl font-bold text-white">Contacts</h2>
                  <p className="text-xs text-gray-400">Select a contact to start chatting</p>
                </div>
                
                <div className="overflow-y-auto h-[calc(100%-70px)]">
                  {friendList.length === 0 ? (
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
                      <p className="text-gray-400 text-sm mb-4">Add friends from the Discover page to start chatting</p>
                      <Link href="/users">
                        <Button
                          variant="primary"
                          size="sm"
                          label="Find Friends"
                        />
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 space-y-1">
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
                          <h2 className="text-white font-bold">{name}</h2>
                          <p className="text-xs text-gray-400">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                          </p>
                        </div>
                        
                        {!isInFriendsList && (
                          <div className="ml-2 bg-cyber-dark/50 px-2 py-1 rounded-md border border-cyber-yellow/30">
                            <span className="text-xs text-cyber-yellow">Not in contacts</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!isInFriendsList && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-cyber-yellow/20 hover:bg-cyber-yellow/30 border-cyber-yellow/30 text-cyber-yellow"
                            onClick={() => {
                              router.push(`/users?addAddress=${address}&addName=${name || 'Unknown'}`);
                            }}
                            label="Add Contact"
                          />
                        )}
                        <button className="w-8 h-8 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 flex items-center justify-center text-cyber-blue transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Message Tabs */}
                    <div className="flex border-b border-cyber-blue/30 bg-cyber-dark/70">
                      <button
                        className={`flex-1 py-2 px-4 text-sm font-medium ${
                          activeTab === "inbox"
                            ? "text-cyber-blue border-b-2 border-cyber-blue"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab("inbox")}
                      >
                        Inbox
                      </button>
                      <button
                        className={`flex-1 py-2 px-4 text-sm font-medium ${
                          activeTab === "requests"
                            ? "text-cyber-yellow border-b-2 border-cyber-yellow"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab("requests")}
                      >
                        Requests
                        {!isInFriendsList && messages.some(m => m.sender !== account) && (
                          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-cyber-yellow rounded-full">
                            !
                          </span>
                        )}
                      </button>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="h-[calc(100vh-350px)] overflow-y-auto p-4 space-y-4 bg-cyber-black/50">
                      {loading ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-pulse flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full border-4 border-t-cyber-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            <p className="text-cyber-blue text-sm">Loading messages...</p>
                          </div>
                        </div>
                      ) : filteredMessages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="text-center max-w-sm p-6 rounded-lg bg-cyber-dark/50 border border-cyber-blue/20">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyber-blue/10 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-blue">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </div>
                            <h3 className="text-white text-lg font-bold mb-2">
                              {activeTab === "inbox" 
                                ? "No messages in your inbox yet" 
                                : "No message requests"
                              }
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {activeTab === "inbox"
                                ? `Start the conversation by sending the first message to ${name}.`
                                : "Messages from users not in your contacts will appear here."
                              }
                            </p>
                          </div>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {filteredMessages.map((message: MessagesType, index: number) => (
                            <motion.div
                              key={`${message.timestamp}-${index}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`flex gap-3 ${message.sender === account ? "justify-end" : "justify-start"}`}
                            >
                              {message.sender !== account && (
                                <div className="w-8 h-8 rounded-full bg-cyber-purple flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-bold text-sm">{name?.charAt(0)}</span>
                                </div>
                              )}
                              <div className={`max-w-[75%] space-y-1 ${message.sender === account ? "items-end" : "items-start"}`}>
                                <div className={`p-3 rounded-lg ${
                                  message.sender === account
                                    ? "bg-cyber-blue/30 border border-cyber-blue/20 rounded-br-none"
                                    : activeTab === "inbox"
                                      ? "bg-cyber-gray border border-cyber-purple/20 rounded-tl-none"
                                      : "bg-cyber-dark border border-cyber-yellow/20 rounded-tl-none"
                                }`}>
                                  <p className="text-white text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                </div>
                                <p className="text-xs text-gray-500">{formatDate(message.timestamp)}</p>
                              </div>
                              {message.sender === account && (
                                <div className="w-8 h-8 rounded-full bg-cyber-blue flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-bold text-sm">You</span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                          <div ref={messagesEndRef} />
                        </AnimatePresence>
                      )}
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-cyber-blue/30 bg-cyber-dark/80">
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="w-full p-3 pr-10 rounded-lg bg-cyber-light border border-cyber-blue/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50"
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-blue/70 hover:text-cyber-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                          </button>
                        </div>
                        <Button
                          onClick={handleSendChat}
                          variant="primary"
                          size="icon"
                          label={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <path d="m22 2-7 20-4-9-9-4Z"></path>
                              <path d="M22 2 11 13"></path>
                            </svg>
                          }
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        {!isInFriendsList && (
                          <div className="text-cyber-yellow animate-pulse">
                            This user is not in your contacts
                          </div>
                        )}
                        {isInFriendsList && (
                          <div className="flex items-center gap-3">
                            <button className="hover:text-cyber-blue">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                <line x1="15" y1="9" x2="15.01" y2="9"></line>
                              </svg>
                            </button>
                            <button className="hover:text-cyber-blue">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 17 10 11 4 5"></path>
                                <path d="M12 19h8"></path>
                              </svg>
                            </button>
                          </div>
                        )}
                        <p>Messages stored on blockchain</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="w-24 h-24 mb-6 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Select a chat to start messaging</h2>
                    <p className="text-gray-400 max-w-md mb-8">
                      Choose a contact from the sidebar to start a secure, blockchain-verified conversation
                    </p>
                    <Link href="/users">
                      <Button
                        variant="glow"
                        label={
                          <span className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <line x1="19" x2="19" y1="8" y2="14"></line>
                              <line x1="22" x2="16" y1="11" y2="11"></line>
                            </svg>
                            Find New Friends
                          </span>
                        }
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
