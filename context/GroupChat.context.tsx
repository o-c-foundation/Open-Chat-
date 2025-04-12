"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Remove the default import and only use named exports
import {
  createGroup,
  getUserGroups,
  joinGroup,
  sendGroupMessage,
  getGroupMessages,
  getGroupDetails,
  isGroupMember,
  getUserGroupRole,
  handleJoinRequest,
  getPendingJoinRequests
} from "@/lib/GroupChatApi";

import { toast } from "@/components/common/Toast";
import { useChatContext } from "@/context/DappChat.context";

// Role enum to match the smart contract
export enum GroupRole {
  MEMBER = 0,
  MODERATOR = 1,
  ADMIN = 2,
  NOT_MEMBER = -1
}

// Types
export interface GroupMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: Date;
  isPrivate: boolean;
  memberCount: number;
}

interface GroupChatContextType {
  groups: Group[];
  currentGroupId: number | null;
  currentGroupMessages: GroupMessage[];
  pendingRequests: string[];
  isLoading: boolean;
  userRole: GroupRole;
  
  fetchUserGroups: () => Promise<void>;
  fetchGroupMessages: (groupId: number) => Promise<void>;
  setCurrentGroup: (groupId: number | null) => void;
  createNewGroup: (name: string, description: string, isPrivate: boolean) => Promise<void>;
  joinGroupById: (groupId: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  acceptJoinRequest: (requesterAddress: string) => Promise<void>;
  rejectJoinRequest: (requesterAddress: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

const GroupChatContext = createContext<GroupChatContextType | undefined>(undefined);

export const GroupChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { account } = useChatContext();
  const router = useRouter();

  // State
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
  const [currentGroupMessages, setCurrentGroupMessages] = useState<GroupMessage[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<GroupRole>(GroupRole.NOT_MEMBER);

  // Load user's groups when account changes
  useEffect(() => {
    if (account) {
      fetchUserGroups();
    }
  }, [account]);

  // Load messages when current group changes
  useEffect(() => {
    if (currentGroupId !== null) {
      fetchGroupMessages(currentGroupId);
      checkUserRole();
      if (userRole >= GroupRole.MODERATOR) {
        fetchPendingRequests();
      }
    }
  }, [currentGroupId]);

  // Fetch user's groups
  const fetchUserGroups = async (): Promise<void> => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      const userGroups = await getUserGroups(account);
      setGroups(userGroups);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a group
  const fetchGroupMessages = async (groupId: number): Promise<void> => {
    setIsLoading(true);
    try {
      // Ensure we're getting fresh data by adding a timestamp parameter
      const timestamp = Date.now();
      console.log(`[fetchGroupMessages] Fetching messages for group ${groupId} at ${timestamp}`);
      
      const messages = await getGroupMessages(groupId);
      console.log(`[fetchGroupMessages] Retrieved ${messages.length} messages`);
      
      // Sort messages by timestamp to ensure proper ordering
      const sortedMessages = [...messages].sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      );
      
      setCurrentGroupMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching group messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check user's role in current group
  const checkUserRole = async (): Promise<void> => {
    if (!account || currentGroupId === null) return;
    
    try {
      const role = await getUserGroupRole(currentGroupId, account);
      setUserRole(role);
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole(GroupRole.NOT_MEMBER);
    }
  };

  // Set current group
  const setCurrentGroup = (groupId: number | null): void => {
    setCurrentGroupId(groupId);
  };

  // Create a new group
  const createNewGroup = async (
    name: string, 
    description: string, 
    isPrivate: boolean
  ): Promise<void> => {
    if (!account) {
      toast({
        title: "Not Connected",
        message: "Please connect your wallet to create a group",
        type: "error",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const groupId = await createGroup(name, description, isPrivate);
      
      // Refresh user's groups
      await fetchUserGroups();
      
      // Navigate to the new group
      setCurrentGroupId(groupId);
      
      toast({
        title: "Group Created",
        message: `Successfully created group "${name}"`,
        type: "success",
      });
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Join a group
  const joinGroupById = async (groupId: number): Promise<void> => {
    if (!account) {
      toast({
        title: "Not Connected",
        message: "Please connect your wallet to join a group",
        type: "error",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await joinGroup(groupId);
      await fetchUserGroups();
      
      // Check if we successfully joined (for public groups)
      const isMember = await isGroupMember(groupId, account);
      if (isMember) {
        setCurrentGroupId(groupId);
      }
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to the current group
  const sendMessage = async (content: string): Promise<void> => {
    if (!currentGroupId) return;
    setIsLoading(true);
    
    try {
      console.log("[GroupChat] Sending message to group", currentGroupId);
      
      // Uses the sendGroupMessage function which now uses session wallet if available
      await sendGroupMessage(currentGroupId, content);
      
      // Give the transaction time to be processed before refreshing
      toast({
        title: "Message Sent!",
        message: "Successfully sent a message to the group.",
        type: "success",
      });
      
      // First immediate refresh attempt
      try {
        console.log("[GroupChat] First refresh attempt");
        await fetchGroupMessages(currentGroupId);
      } catch (error) {
        console.error("[GroupChat] Error in first refresh:", error);
      }
      
      // Then multiple delayed refreshes to ensure we catch the message
      setTimeout(async () => {
        console.log("[GroupChat] Refreshing messages after 3s delay");
        try {
          await fetchGroupMessages(currentGroupId);
        } catch (error) {
          console.error("[GroupChat] Error in 3s delayed refresh:", error);
        }
        
        // One more refresh after a longer delay
        setTimeout(async () => {
          console.log("[GroupChat] Refreshing messages after 6s delay");
          try {
            await fetchGroupMessages(currentGroupId);
          } catch (error) {
            console.error("[GroupChat] Error in 6s delayed refresh:", error);
          }
        }, 3000);
      }, 3000);
      
    } catch (error) {
      console.error("[GroupChat] Error sending message:", error);
      toast({
        title: "Error",
        message: "Failed to send message. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pending join requests
  const fetchPendingRequests = async (): Promise<void> => {
    if (!account || currentGroupId === null || userRole < GroupRole.MODERATOR) return;
    
    try {
      const requests = await getPendingJoinRequests(currentGroupId);
      setPendingRequests(requests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  // Accept a join request
  const acceptJoinRequest = async (requesterAddress: string): Promise<void> => {
    if (!account || currentGroupId === null || userRole < GroupRole.MODERATOR) {
      toast({
        title: "Permission Denied",
        message: "You don't have permission to accept join requests",
        type: "error",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await handleJoinRequest(currentGroupId, requesterAddress, true);
      
      // Refresh pending requests
      await fetchPendingRequests();
      
      toast({
        title: "Request Accepted",
        message: "User has been added to the group",
        type: "success",
      });
    } catch (error) {
      console.error("Error accepting join request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reject a join request
  const rejectJoinRequest = async (requesterAddress: string): Promise<void> => {
    if (!account || currentGroupId === null || userRole < GroupRole.MODERATOR) {
      toast({
        title: "Permission Denied",
        message: "You don't have permission to reject join requests",
        type: "error",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await handleJoinRequest(currentGroupId, requesterAddress, false);
      
      // Refresh pending requests
      await fetchPendingRequests();
      
      toast({
        title: "Request Rejected",
        message: "Join request has been rejected",
        type: "success",
      });
    } catch (error) {
      console.error("Error rejecting join request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refresh of messages
  const refreshMessages = async (): Promise<void> => {
    if (currentGroupId !== null) {
      await fetchGroupMessages(currentGroupId);
    }
  };

  const contextValue: GroupChatContextType = {
    groups,
    currentGroupId,
    currentGroupMessages,
    pendingRequests,
    isLoading,
    userRole,
    
    fetchUserGroups,
    fetchGroupMessages,
    setCurrentGroup,
    createNewGroup,
    joinGroupById,
    sendMessage,
    fetchPendingRequests,
    acceptJoinRequest,
    rejectJoinRequest,
    refreshMessages,
  };

  return (
    <GroupChatContext.Provider value={contextValue}>
      {children}
    </GroupChatContext.Provider>
  );
};

export const useGroupChatContext = (): GroupChatContextType => {
  const context = useContext(GroupChatContext);
  if (context === undefined) {
    throw new Error("useGroupChatContext must be used within a GroupChatProvider");
  }
  return context;
}; 