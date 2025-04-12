# Architecture Overview

## System Architecture

OpenChat is designed as a decentralized messaging application that operates exclusively on blockchain test networks. The system implements a microservice architecture pattern with clear separation of concerns, ensuring modularity and scalability.

![System Architecture Diagram](https://mermaid.ink/img/pako:eNqNk0FrwzAMhf-K0CmDtXTdLctgY4PDGIPtVHIwttJE1LGD7UApIf-9OHGzNmkpu8WW3idLepLnoDUjyCGzVFl0loTFG8iPw9F4FN4oJVzKvD6UQoNwOyy4rGxT5DUqjY221kuZYiHXtmYKS1E0EpyHVMGK2dJSQMYECoeKlkRTSEWzmJHSkhqKHAzXQJNqMUmQNBuKiYxSOk-Sf4PhYpHZSJJi4-fR6Dd8KWx8tEpfGWMpIluJtRddKUNt2iU8Pjl7dDZdPj0vVmDWbz9wt9vt8X7fjQbdpBf2PwcPHAJ6vZfoB2PwE6ZE-v_kn6xKLc0JgU-bI9IQjkv3nqDlRDvUzpE5tD_F2VxitUPzgB_huPyKgU1FxjOr5RnsKFTNwBg0IHPBWIF0UxMNQo3TIQ9yZ44lTERRszYXQCHIOa8sFV7g5XHsszF3N3TY_4IfRVfH1FT_AtBLAV8?type=png)

### Key Components

1. **Frontend Application**
   - Next.js React application
   - Responsive design with Tailwind CSS
   - Client-side blockchain integration via ethers.js

2. **Smart Contracts**
   - DappChat.sol - Core messaging contract
   - OpenChatGroups.sol - Group chat functionality
   - Deployed on multiple testnets (Sepolia, Goerli, Mumbai)

3. **Blockchain Integration Layer**
   - Custom API wrappers
   - Session wallet management
   - Cross-network compatibility

4. **Security Layer**
   - Testnet restrictions
   - Session wallet implementation
   - Signature verification

## Data Flow

The system implements a unidirectional data flow pattern:

1. User interactions trigger state changes in React components
2. State changes propagate through the context provider system
3. Context providers interact with the blockchain via API layer
4. Smart contracts execute operations and emit events
5. Events are captured by the frontend and update the UI

### Communication Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Context
    participant API
    participant SessionWallet
    participant Blockchain
    
    User->>UI: Initiates action
    UI->>Context: Updates state
    Context->>API: Calls API method
    API->>SessionWallet: Checks for session wallet
    alt Has valid session wallet
        SessionWallet->>Blockchain: Signs and sends transaction
    else No session wallet
        API->>Blockchain: Requests MetaMask signature
        Blockchain->>User: Prompts for signature
        User->>Blockchain: Approves transaction
    end
    Blockchain->>API: Returns result
    API->>Context: Updates state
    Context->>UI: Re-renders with new data
    UI->>User: Displays result
```

## Network Architecture

OpenChat operates exclusively on testnet environments, with primary support for:

- Ethereum Sepolia (primary)
- Ethereum Goerli
- Polygon Mumbai
- BSC Testnet

The application implements network detection and automatic switching to ensure users remain on supported testnets. 