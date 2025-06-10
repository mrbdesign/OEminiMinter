Mintable Frame
A minimalist Farcaster Frame for minting NFTs with a single click.

This project is a customized fork of jc4p/mintable-frame. Huge thanks to the original author for the clean foundation!

Setup
Clone this repository

Install dependencies with npm install or bun install

Start the development server with npm run dev or bun run dev

Deployment
To make your Frame accessible to users, you need to deploy it to a public URL:

For development and testing, the Frame currently uses http://localhost:5173 in the Frame metadata.

For production, deploy the app to a hosting service like Vercel, Netlify, or GitHub Pages.

Update the Frame URL in index.html by changing this part of the fc:frame meta tag:

xml
"url":"http://localhost:5173"
to your production URL, for example:

xml
"url":"https://your-mintable-frame.vercel.app"
Also update the imageUrl in the same meta tag to use an image hosted on your production domain or a reliable image hosting service, e.g.:

xml
"imageUrl":"https://your-mintable-frame.vercel.app/images/GO-HIGHER.gif"
Contract Setup
This frame requires a compatible NFT contract to work with. Follow these steps:

Follow the instructions in the mintable-nft-contract repository to deploy your NFT contract.

After deploying your contract, update the contractAddress in src/main.js with your actual contract address:

javascript
const contractAddress = '0xYourContractAddressHere';
Customization
You can customize the frame by:

Changing the preview image in the HTML (now using /images/GO-HIGHER.gif)

Modifying the title text (currently "Mint NFT")

Adjusting colors and styling in style.css

Important Notes
The mint function in this fork uses the $HIGHER ERC20 token for payment instead of ETH.

The contract is configured to work on Base Mainnet (chainId 8453).

Users will be prompted to switch networks if they're not on Base.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Shoutout:
Original minimalist frame by jc4p.
Customization and $HIGHER integration by [your name or org].