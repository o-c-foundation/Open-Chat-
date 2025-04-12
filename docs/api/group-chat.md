# Group Chat API Reference

## Overview

The Group Chat API provides a comprehensive interface for interacting with the OpenChat group messaging functionality. This module enables the creation, management, and messaging within decentralized chat groups on the blockchain.

![Group Chat Architecture](https://mermaid.ink/img/pako:eNqNk99v2jAQx_-VSx96aaW0EAjlo1Klatq0h2nSpKnqwxRxy5HAXmRfpygN_705TigEtsnwg-3z-Xu-O99dZrwgzGR-QlNpFVOaUaNeUfb8Mu-N-2-IiLqVQ_5hcqHRu1zktKhMPcpzJOiNNe0yKqgrtqZCCbkYpTiFSMIGaekFB4Ys-kIb2lMRJigsHYJOKGasGAqwcY9D5o4ZsWpMKAYyFsdxdFkZHGsQqDLJXeGZNeVG_GF0NXqqJJZK-Q7HbMHm_X5S1_19VHNcE-PZyYy557z2CW8oUeaoHQpvKUYrRSo2FI9Ry5jmLkgpsEBpCq0NeaRPp4FpGblRJG1T5u2i9KkiV9xzpgp34jBkRyuXaZZELIrihZ4p_fZwf_98d-_W0l1k3-b_PtVA8hkLpvwZKhyFbfELCwMjdYliPuRapbL6n9cJ_ZzXyR2b26vJMqr_eTqdpWs7o3OcnJGPKzp5K3XwCmh-1RVe7XrSCsQahiCwOOgL5bxgZuHb41fxVV1pZV5TH7Qlt99nXcvw2cDCjlbTMmIHo-wLF0sUd97lUX4y5VCe5VZuyRpWWh2uWDZmNBW5oQnNp1mhtHM57dH9GzN_k5swF2Qmi0Kau9zB0cKOI7NL0NAXP5LiUhbY0N9QQrZbspnAiDFN5SipXWE2pK_Dp0Ewslut56BJ_U7pSCPkYcYyQwvn8HzLnMwBD73s-n8d8PjUa-DaWspc4fsBmIUC7g?type=png)

## Core Group Chat Methods

### Creating a Group

```typescript
/**
 * Create a new chat group
 * @param name Group name
 * @param description Group description
 * @param isPrivate Whether the group is private (requires admin approval to join)
 * @returns The ID of the newly created group
 */
const createGroup = async (
  name: string, 
  description: string, 
  isPrivate: boolean
): Promise<number>
```

Example:
```typescript
const groupId = await createGroup("Blockchain Developers", "A group for blockchain developers", false);
console.log(`Created group with ID: ${groupId}`);
```

### Joining a Group

```typescript
/**
 * Join an existing group by ID
 * @param groupId The ID of the group to join
 * @returns Promise that resolves when the join operation is complete
 */
const joinGroup = async (groupId: number): Promise<void>
```

Example:
```typescript
await joinGroup(42);
console.log("Successfully joined the group!");
```

### Sending Messages

```typescript
/**
 * Send a message to a group
 * @param groupId The ID of the target group
 * @param content The message content
 * @returns Promise that resolves when message is sent
 */
const sendGroupMessage = async (groupId: number, content: string): Promise<void>
```

Example:
```typescript
await sendGroupMessage(42, "Hello everyone! This is my first message.");
```

### Retrieving Messages

```typescript
/**
 * Get all messages from a group
 * @param groupId The ID of the group
 * @returns Array of message objects
 */
const getGroupMessages = async (groupId: number): Promise<GroupMessage[]>
```

Example:
```typescript
const messages = await getGroupMessages(42);
messages.forEach(msg => {
  console.log(`${msg.sender}: ${msg.content} (${msg.timestamp.toLocaleString()})`);
});
```

## Admin Functions

### Managing Join Requests

```typescript
/**
 * Accept or reject a join request
 * @param groupId Group ID
 * @param requesterAddress Address of the user requesting to join
 * @param accept Whether to accept (true) or reject (false) the request
 */
const handleJoinRequest = async (
  groupId: number,
  requesterAddress: string,
  accept: boolean
): Promise<void>
```

Example:
```typescript
// Accept a join request
await handleJoinRequest(42, "0x1234...abcd", true);

// Reject a join request
await handleJoinRequest(42, "0x5678...efgh", false);
```

### Viewing Pending Requests

```typescript
/**
 * Get all pending join requests for a group
 * @param groupId Group ID
 * @returns Array of addresses that have requested to join
 */
const getPendingJoinRequests = async (groupId: number): Promise<string[]>
```

Example:
```typescript
const pendingRequests = await getPendingJoinRequests(42);
console.log(`There are ${pendingRequests.length} pending join requests`);
```

## Smart Contract Integration

The Group Chat API interacts with the `OpenChatGroups.sol` smart contract deployed on the Sepolia testnet at address `0x27D3cc433353aE5357902D442A495Ee3d3cC2eDD`.

### Key Contract Methods

```solidity
// Create a new group
function createGroup(string memory name, string memory description, bool isPrivate) external returns (uint256);

// Join a group
function joinGroup(uint256 groupId) external;

// Send a message to a group
function sendMessage(uint256 groupId, string memory content) external returns (uint256);

// Get all messages in a group
function getGroupMessages(uint256 groupId) external view returns (Message[] memory);
```

## Session Wallet Integration

The Group Chat API fully integrates with OpenChat's Session Wallet system, providing automatic transaction signing for message sending.

```typescript
if (hasSessionWallet() && isSessionWalletVerified()) {
  // Use session wallet for seamless messaging experience
  const sessionSigner = await getSessionSigner();
  if (sessionSigner) {
    // Send message with automatic signing
  }
}
```

## Data Types

### GroupMessage

```typescript
interface GroupMessage {
  sender: string;     // Address of sender
  content: string;    // Message content
  timestamp: Date;    // Message timestamp
}
```

### Group

```typescript
interface Group {
  id: number;          // Group ID
  name: string;        // Group name
  description: string; // Group description
  owner: string;       // Address of group creator
  createdAt: Date;     // Creation timestamp
  isPrivate: boolean;  // Whether group requires join approval
  memberCount: number; // Number of members
}
```

## Error Handling

The API includes comprehensive error handling for common scenarios:

- Network connection issues
- Non-member access attempts
- Insufficient permissions
- Duplicate join requests
- Contract interaction failures 