import './style.css'
import * as frame from '@farcaster/frame-sdk'
import { ethers } from 'ethers'

document.querySelector('#app').innerHTML = `
  <div>
    <img src="/images/GO-HIGHER.gif" class="featured-image" alt="GO-HIGHER NFT Preview" />
    <div class="card">
      <button id="mint-button" class="gold-button" type="button">Mint NFT</button>
    </div>
    <div id="notification" class="notification"></div>
  </div>
`

function showNotification(message, duration = 10000) {
  const notificationEl = document.getElementById('notification')
  notificationEl.textContent = message
  notificationEl.style.opacity = '1'
  if (window.notificationTimeout) clearTimeout(window.notificationTimeout)
  window.notificationTimeout = setTimeout(() => {
    notificationEl.style.opacity = '0'
  }, duration)
}

document.addEventListener('DOMContentLoaded', async () => {
  frame.sdk.actions.ready()

  async function connectWallet() {
    try {
      const accounts = await frame.sdk.wallet.ethProvider.request({
        method: 'eth_requestAccounts',
      })
      if (accounts && accounts[0]) {
        const chainId = await frame.sdk.wallet.ethProvider.request({
          method: 'eth_chainId',
        })
        const chainIdDecimal =
          typeof chainId === 'number' ? chainId : parseInt(chainId, 16)
        if (chainIdDecimal !== 8453) {
          showNotification('Please switch to Base Mainnet')
          await frame.sdk.wallet.ethProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }],
          })
        }
        return accounts[0]
      }
    } catch (error) {
      showNotification('Wallet connection failed')
      return null
    }
  }

  document.getElementById('mint-button').addEventListener('click', async () => {
    const contractAddress = '0x93c452a1Fe34280239a9eD26C320FD50F6772546' // Your ERC-1155 contract
    const erc20Address = '0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe' // $HIGHER token
    const mintAmount = 1
    const pricePerMint = ethers.parseUnits('1', 18) // 1 $HIGHER per mint

    const erc20Abi = [
      'function approve(address spender, uint256 amount) public returns (bool)',
    ]
    const mintAbi = [
      'function mint(address to, uint256 id, uint256 amount, bytes data) public',
    ]

    const tokenId = 1 // Adjust if needed

    const mintButton = document.getElementById('mint-button')
    mintButton.disabled = true
    mintButton.textContent = 'Preparing...'

    try {
      const walletAddress = await connectWallet()
      if (!walletAddress) {
        showNotification('Please connect your wallet')
        mintButton.disabled = false
        mintButton.textContent = 'Mint NFT'
        return
      }

      // Approve $HIGHER transfer
      mintButton.textContent = 'Approving $HIGHER...'
      const erc20Interface = new ethers.Interface(erc20Abi)
      const approveData = erc20Interface.encodeFunctionData('approve', [
        contractAddress,
        pricePerMint,
      ])
      await frame.sdk.wallet.ethProvider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: walletAddress,
            to: erc20Address,
            data: approveData,
          },
        ],
      })

      // Mint NFT
      mintButton.textContent = 'Minting...'
      const mintInterface = new ethers.Interface(mintAbi)
      const mintData = mintInterface.encodeFunctionData('mint', [
        walletAddress,
        tokenId,
        mintAmount,
        '0x',
      ])
      await frame.sdk.wallet.ethProvider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: walletAddress,
            to: contractAddress,
            data: mintData,
          },
        ],
      })

      showNotification('Mint successful! Check your wallet soon.')
    } catch (error) {
      showNotification(`Minting failed: ${error.message}`)
    } finally {
      mintButton.disabled = false
      mintButton.textContent = 'Mint NFT'
    }
  })
})
