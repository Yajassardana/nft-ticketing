import React from 'react';
import { Wallet } from 'lucide-react';
import type { WalletState } from '../types/wallet';

interface WalletConnectProps {
  wallet: WalletState;
  loading: boolean;
  onConnect: () => void;
}

export function WalletConnect({ wallet, loading, onConnect }: WalletConnectProps) {
  if (wallet.address) {
    return (
      <p className="text-sm text-gray-600 text-center">
        Connected: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
      </p>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={loading}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet size={20} />
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}