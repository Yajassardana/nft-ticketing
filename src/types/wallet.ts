import type { ethers } from 'ethers';

export interface WalletState {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string | null;
}

export interface WalletError {
  code: string;
  message: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}