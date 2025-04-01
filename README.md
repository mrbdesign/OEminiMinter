# Mintable Frame

A simple Farcaster Frame for minting NFTs with a single click.

## Setup

1. Clone this repository
2. Install dependencies with `npm install` or `bun install`
3. Start the development server with `npm run dev` or `bun run dev`

## Deployment

To make your Frame accessible to users, you need to deploy it to a public URL:

1. For development and testing, the Frame currently uses `http://localhost:5173` in the Frame metadata
2. For production, deploy the app to a hosting service like Vercel, Netlify, or GitHub Pages
3. Update the Frame URL in `index.html` by changing this part of the `fc:frame` meta tag:
   ```html
   "url":"http://localhost:5173"
   ```
   to your production URL, for example:
   ```html
   "url":"https://your-mintable-frame.vercel.app"
   ```
4. Also update the `imageUrl` in the same meta tag to use an image hosted on your production domain or a reliable image hosting service

## Contract Setup

This frame requires a compatible NFT contract to work with. Follow these steps:

1. Follow the instructions in the [mintable-nft-contract](https://github.com/jc4p/mintable-nft-contract) repository to deploy your NFT contract
2. After deploying your contract, update the `contractAddress` in `src/main.js` (around line 96) with your actual contract address

```javascript
// Define the contract address - replace with your actual address from mintable-nft-contract
const contractAddress = '0x1234567890123456789012345678901234567890';
```

## Customization

You can customize the frame by:
- Changing the image URL in the HTML (currently using https://images.kasra.codes/smoothie_cup.jpeg)
- Modifying the title text (currently "Mint This")
- Adjusting colors and styling in style.css

## Important Notes

- The mint function requires sending 0.0025 ETH alongside the transaction
- The contract is configured to work on Base Mainnet (chainId 8453)
- Users will be prompted to switch networks if they're not on Base
