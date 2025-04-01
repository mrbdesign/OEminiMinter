import './style.css'
import * as frame from '@farcaster/frame-sdk'

document.querySelector('#app').innerHTML = `
  <div>
    <img src="https://images.kasra.codes/smoothie_cup.jpeg" class="featured-image" alt="Smoothie Cup" />
    <div class="card">
      <button id="mint-button" class="gold-button" type="button">Mint NFT</button>
    </div>
    <div id="notification" class="notification"></div>
  </div>
`

// Function to show notifications instead of alerts
function showNotification(message, duration = 10000) {
  const notificationEl = document.getElementById('notification');
  notificationEl.textContent = message;
  notificationEl.style.opacity = '1';
  
  // Clear previous timeout
  if (window.notificationTimeout) {
    clearTimeout(window.notificationTimeout);
  }
  
  // Hide after duration
  window.notificationTimeout = setTimeout(() => {
    notificationEl.style.opacity = '0';
  }, duration);
}

// Initialize the frame
document.addEventListener('DOMContentLoaded', async () => {
  // Tell the frame we're ready
  frame.sdk.actions.ready();
  
  // Initialize frame
  try {
    await frame.sdk.context.user;
  } catch (error) {
    console.error('Error initializing:', error);
  }

  // Automatically request wallet access when needed
  async function connectWallet() {
    try {
      // Request accounts
      const accounts = await frame.sdk.wallet.ethProvider.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts[0]) {
        // Check network
        const chainId = await frame.sdk.wallet.ethProvider.request({
          method: 'eth_chainId'
        });
        
        const chainIdDecimal = typeof chainId === 'number' ? chainId : parseInt(chainId, 16);
        
        if (chainIdDecimal !== 8453) {
          showNotification('Please switch to Base Mainnet');
          await frame.sdk.wallet.ethProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }] // Base mainnet chainId
          });
        }
        
        return accounts[0];
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }
  
  // Handle mint button
  document.getElementById('mint-button').addEventListener('click', async () => {
    try {
      // Define the contract address - this is just an example, replace with your actual address
      const contractAddress = '0x1234567890123456789012345678901234567890';

      // Make button inactive while transaction is processing
      document.getElementById('mint-button').disabled = true;
      document.getElementById('mint-button').textContent = 'Switching to Base...';
      
      
      // Get the account
      const walletAddress = await connectWallet();
      if (!walletAddress) {
        showNotification('Please connect your wallet');
        document.getElementById('mint-button').disabled = false;
        document.getElementById('mint-button').textContent = 'Mint NFT';
        return;
      }

      document.getElementById('mint-button').textContent = 'Minting...';
      
      // Create the mint function signature
      const mintFunctionSignature = '0x1249c58b'; // keccak256('mint()')
      
      // Convert ETH value to hex (0.0025 ETH)
      const ethValue = '0x' + (0.0025 * 10**18).toString(16);
      
      const txHash = await frame.sdk.wallet.ethProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: contractAddress,
          data: mintFunctionSignature,
          value: ethValue // Add ETH value to the transaction
        }]
      });
      
      showNotification(`Transaction sent: ${txHash} -- check your Warplet in a few minutes to see it!`);
      
      // Re-enable after 15 seconds
      setTimeout(() => {
        document.getElementById('mint-button').disabled = false;
        document.getElementById('mint-button').textContent = 'Mint NFT';
      }, 15000);
    } catch (error) {
      console.error('Error minting:', error);
      showNotification(`Minting failed: ${error.message}`);
      // Reset button state
      document.getElementById('mint-button').disabled = false;
      document.getElementById('mint-button').textContent = 'Mint NFT';
    }
  });
  
});
