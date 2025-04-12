"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useGroupChatContext, GroupRole, Group, GroupMessage } from "@/context/GroupChat.context";
import { useChatContext } from "@/context/DappChat.context";
import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Loading from "@/components/common/Loading";

const GroupChatUI = () => {
  const {
    groups,
    currentGroupId,
    currentGroupMessages,
    pendingRequests,
    isLoading,
    userRole,
    fetchUserGroups,
    setCurrentGroup,
    createNewGroup,
    joinGroupById,
    sendMessage,
    fetchPendingRequests,
    acceptJoinRequest,
    rejectJoinRequest,
    refreshMessages,
  } = useGroupChatContext();

  const { account, username } = useChatContext();

  // UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentGroupMessages]);

  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentGroupId) {
        refreshMessages();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentGroupId, refreshMessages]);

  // Close sidebar when selecting a group on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  }, [currentGroupId]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentGroupId !== null) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  // Handle create group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim() && newGroupDescription.trim()) {
      await createNewGroup(newGroupName, newGroupDescription, newGroupIsPrivate);
      setShowCreateModal(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupIsPrivate(false);
    }
  };

  // Handle join group
  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinGroupId.trim()) {
      const groupIdNumber = parseInt(joinGroupId);
      if (!isNaN(groupIdNumber)) {
        await joinGroupById(groupIdNumber);
        setShowJoinModal(false);
        setJoinGroupId("");
      }
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Get current group
  const currentGroup = groups.find(group => group.id === currentGroupId);
  
  // Not connected state
  if (!account) {
    return (
      <div className="container mx-auto pt-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Heading size="default">Group Chat</Heading>
          <Paragraph className="mt-5">
            Please connect your wallet to access group chats.
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-6 pb-10 px-2 sm:px-4">
      {isLoading && <Loading />}
      
      <div className="relative flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Mobile sidebar toggle button */}
        <div className="lg:hidden mb-2 flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 rounded-lg flex items-center text-white transition-colors"
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
              className="mr-2"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            {showSidebar ? "Hide Groups" : "Show Groups"}
          </button>
          
          {currentGroup && (
            <div className="text-white font-medium">
              {currentGroup.name}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className={`w-full lg:w-1/4 transition-all duration-300 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-cyber-gradient rounded-xl p-4 sm:p-6 border border-cyber-blue/30 shadow-cyber mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Heading size="sm">Your Groups</Heading>
              <button
                onClick={() => fetchUserGroups()}
                className="p-2 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 text-white transition-colors"
                title="Refresh groups"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v6h6"></path>
                  <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                  <path d="M21 22v-6h-6"></path>
                  <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                </svg>
              </button>
            </div>
            
            {groups.length === 0 ? (
              <div className="text-gray-400 text-sm">
                You haven't joined any groups yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setCurrentGroup(group.id)}
                    className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors ${
                      currentGroupId === group.id
                        ? "bg-cyber-blue/20 border border-cyber-blue/40"
                        : "bg-cyber-dark/40 hover:bg-cyber-dark/60 border border-cyber-blue/10"
                    }`}
                  >
                    <div className="font-medium text-white text-sm sm:text-base">{group.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {group.memberCount} member{group.memberCount !== 1 ? "s" : ""} • {group.isPrivate ? "Private" : "Public"}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-4 sm:mt-6 flex flex-col xs:flex-row lg:flex-col gap-2">
              <Button
                className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm sm:text-base"
                onClick={() => setShowCreateModal(true)}
                label="Create Group"
              />
              <Button
                className="w-full bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-blue/30 text-sm sm:text-base"
                onClick={() => setShowJoinModal(true)}
                label="Join Group"
              />
            </div>
          </div>
          
          {/* Admin Panel (only shown for moderators and admins) */}
          {currentGroupId !== null && userRole >= GroupRole.MODERATOR && (
            <div className="bg-cyber-gradient rounded-xl p-4 sm:p-6 border border-cyber-green/30 shadow-cyber">
              <Heading size="sm" className="mb-4">Admin Panel</Heading>
              
              <Button
                className="w-full bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-green/30 mb-2 text-sm sm:text-base"
                onClick={() => {
                  fetchPendingRequests();
                  setShowRequestsModal(true);
                }}
                label="Manage Join Requests"
              />
              
              <div className="text-xs text-gray-400 mt-2">
                You are a {userRole === GroupRole.ADMIN ? "group admin" : "moderator"}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Chat Area */}
        <div className="w-full lg:w-3/4">
          {currentGroupId === null ? (
            <div className="bg-cyber-gradient rounded-xl p-4 sm:p-8 border border-cyber-blue/30 shadow-cyber h-[400px] sm:h-[500px] md:h-[600px] flex flex-col items-center justify-center">
              <div className="text-center max-w-md">
                <Heading size="sm" className="mb-4">Select or Join a Group</Heading>
                <Paragraph className="text-gray-300 mb-6 text-sm sm:text-base">
                  Choose a group from the sidebar or create a new one to start chatting.
                </Paragraph>
                <div className="flex flex-col xs:flex-row justify-center gap-3 xs:space-x-4">
                  <Button
                    className="w-full xs:w-auto bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm sm:text-base"
                    onClick={() => setShowCreateModal(true)}
                    label="Create Group"
                  />
                  <Button
                    className="w-full xs:w-auto bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-blue/30 text-sm sm:text-base"
                    onClick={() => setShowJoinModal(true)}
                    label="Join Group"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-cyber-gradient rounded-xl border border-cyber-blue/30 shadow-cyber h-[400px] sm:h-[500px] md:h-[600px] flex flex-col">
              {/* Group Header */}
              <div className="p-3 sm:p-4 border-b border-cyber-blue/20 flex justify-between items-center">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white">
                    {currentGroup?.name}
                  </h2>
                  <div className="text-xs text-gray-400">
                    {currentGroup?.memberCount} member{currentGroup?.memberCount !== 1 ? "s" : ""} • 
                    {currentGroup?.isPrivate ? " Private" : " Public"} group
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => refreshMessages()}
                    className="p-2 rounded-full bg-cyber-blue/10 hover:bg-cyber-blue/20 text-white transition-colors"
                    title="Refresh messages"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 2v6h6"></path>
                      <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                      <path d="M21 22v-6h-6"></path>
                      <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
              >
                {currentGroupMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-center p-4">
                    <div>
                      <div className="mb-2">No messages yet</div>
                      <div className="text-sm">Be the first to send a message in this group!</div>
                    </div>
                  </div>
                ) : (
                  currentGroupMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender.toLowerCase() === account.toLowerCase()
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[85%] break-words sm:max-w-[75%] ${
                          message.sender.toLowerCase() === account.toLowerCase()
                            ? "bg-cyber-blue/20 border border-cyber-blue/30"
                            : "bg-cyber-dark/60 border border-cyber-blue/10"
                        }`}
                      >
                        <div className={`text-xs mb-1 font-medium ${
                          message.sender.toLowerCase() === account.toLowerCase()
                            ? "text-cyber-blue"
                            : "text-gray-400"
                        }`}>
                          {message.sender === account
                            ? "You"
                            : message.sender.slice(0, 6) + "..." + message.sender.slice(-4)}
                        </div>
                        <div className="text-white text-sm sm:text-base">{message.content}</div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input Area */}
              <div className="p-3 sm:p-4 border-t border-cyber-blue/20">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-cyber-dark border border-cyber-blue/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyber-blue/50 text-sm sm:text-base"
                  />
                  <Button
                    type="submit"
                    className="bg-cyber-blue hover:bg-cyber-blue/80 text-white px-3 sm:px-4 h-[40px]"
                    disabled={!newMessage.trim()}
                    label={
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    }
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cyber-gradient border border-cyber-blue/50 rounded-lg shadow-cyber max-w-md w-full p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-blue/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyber-blue/50"
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-blue/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyber-blue/50 min-h-[80px]"
                  placeholder="Enter group description"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center text-gray-300 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={newGroupIsPrivate}
                    onChange={(e) => setNewGroupIsPrivate(e.target.checked)}
                    className="mr-2"
                  />
                  Private Group (requires admin approval to join)
                </label>
              </div>
              <div className="flex flex-col xs:flex-row justify-end gap-3 xs:space-x-4">
                <Button
                  type="button"
                  className="w-full xs:w-auto text-center bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-blue/30"
                  onClick={() => setShowCreateModal(false)}
                  label="Cancel"
                />
                <Button
                  type="submit"
                  className="w-full xs:w-auto text-center bg-cyber-blue hover:bg-cyber-blue/80 text-white"
                  label="Create Group"
                  disabled={!newGroupName.trim() || !newGroupDescription.trim()}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cyber-gradient border border-cyber-blue/50 rounded-lg shadow-cyber max-w-md w-full p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Join a Group</h2>
            <form onSubmit={handleJoinGroup}>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Group ID
                </label>
                <input
                  type="text"
                  value={joinGroupId}
                  onChange={(e) => setJoinGroupId(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-blue/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyber-blue/50"
                  placeholder="Enter group ID number"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can join a group by entering its ID. For private groups, you'll need to wait for admin approval.
                </p>
              </div>
              <div className="flex flex-col xs:flex-row justify-end gap-3 xs:space-x-4">
                <Button
                  type="button"
                  className="w-full xs:w-auto text-center bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-blue/30"
                  onClick={() => setShowJoinModal(false)}
                  label="Cancel"
                />
                <Button
                  type="submit"
                  className="w-full xs:w-auto text-center bg-cyber-blue hover:bg-cyber-blue/80 text-white"
                  label="Join Group"
                  disabled={!joinGroupId.trim()}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Pending Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cyber-gradient border border-cyber-blue/50 rounded-lg shadow-cyber max-w-md w-full p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Pending Join Requests</h2>
            
            {pendingRequests.length === 0 ? (
              <div className="text-gray-300 mb-6">No pending requests at this time.</div>
            ) : (
              <div className="mb-6 max-h-60 overflow-y-auto">
                {pendingRequests.map((address, index) => (
                  <div key={index} className="bg-cyber-dark/50 p-3 rounded-lg mb-3 flex items-center justify-between">
                    <div className="text-white text-sm truncate">{address}</div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptJoinRequest(address)}
                        className="p-1 bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green rounded-md transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                      <button
                        onClick={() => rejectJoinRequest(address)}
                        className="p-1 bg-cyber-red/20 hover:bg-cyber-red/30 text-cyber-red rounded-md transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                className="bg-cyber-dark hover:bg-cyber-dark/70 text-white border border-cyber-blue/30"
                onClick={() => setShowRequestsModal(false)}
                label="Close"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChatUI; 