# OpenChat

A decentralized messaging platform built for EVM-compatible blockchains, with a focus on testnet networks. OpenChat provides secure, on-chain messaging with a modern, intuitive interface.

## Features

- **Direct Messaging**: Send private messages to any blockchain address
- **Group Chat**: Create and join group conversations
- **Session Wallet System**: Interact without constant transaction confirmations
- **Multi-Network Support**: Works across various testnet networks
- **Modern UI**: Clean, responsive design with dark/light mode support

## Technologies

- Next.js 13 (App Router)
- React
- TypeScript
- Tailwind CSS
- Ethers.js
- Web3Modal
- Liveblocks

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A web3 wallet (MetaMask recommended)

### Installation

1. Clone the repository
```bash
git clone https://github.com/opencryptofoundation/openchat.git
cd openchat
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your API keys and configuration.

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

OpenChat is built on a modular architecture:

- **Context Providers**: DappChat, GroupChat, and SessionWallet contexts manage state
- **API Layer**: Handles blockchain interactions and messaging protocols
- **UI Components**: Reusable, responsive interface elements
- **Helper Utilities**: Functions for wallet management, formatting, and more

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Developed and maintained by The Open Crypto Foundation.

---

*OpenChat - Connecting blockchain users through secure, decentralized messaging*
