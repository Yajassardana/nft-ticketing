import { ethers } from 'ethers';
import type { WalletState } from '../types/wallet';

export const connectWallet = async (): Promise<WalletState> => {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask to use this application');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // Switch to Polygon network if not already on it
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/']
          }]
        });
      } else {
        throw switchError;
      }
    }

    return { provider, signer, address };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Please connect your wallet to continue');
    }
    throw error;
  }
};

export const checkWalletConnection = async (): Promise<WalletState | null> => {
  if (!window.ethereum) return null;
  
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    
    if (accounts.length === 0) return null;
    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    return { provider, signer, address };
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return null;
  }
};