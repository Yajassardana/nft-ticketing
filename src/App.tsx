import React, { useState, useEffect } from 'react';
import { connectWallet, checkWalletConnection } from './utils/web3';
import { buyTicket, enterEvent, endEvent, checkPoap } from './utils/contract';
import { WalletConnect } from './components/WalletConnect';
import { EventActions } from './components/EventActions';
import type { WalletState } from './types/wallet';

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    provider: null,
    signer: null,
    address: null,
  });
  const [eventId, setEventId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasPoap, setHasPoap] = useState<boolean>(false);

  useEffect(() => {
    checkWalletConnection().then((walletData) => {
      if (walletData) {
        setWallet(walletData);
        checkPoapStatus(walletData);
      }
    });
  }, []);

  const checkPoapStatus = async (walletData: WalletState) => {
    if (walletData.address && eventId) {
      try {
        const poap = await checkPoap(walletData, walletData.address, eventId);
        setHasPoap(poap);
      } catch (error) {
        console.error('Error checking POAP status:', error);
      }
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      const walletData = await connectWallet();
      setWallet(walletData);
      await checkPoapStatus(walletData);
    } catch (error: any) {
      setError(error.message);
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = async () => {
    if (!wallet.signer) {
      setError('Please connect your wallet first');
      return;
    }
    if (!eventId) {
      setError('Please enter an event ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await buyTicket(wallet, eventId);
      setError('Ticket purchased successfully!');
    } catch (error: any) {
      setError(error.message);
      console.error('Failed to buy ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterEvent = async () => {
    if (!wallet.signer) {
      setError('Please connect your wallet first');
      return;
    }
    if (!eventId) {
      setError('Please enter an event ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await enterEvent(wallet, eventId);
      await checkPoapStatus(wallet);
      setError('Successfully entered the event!');
    } catch (error: any) {
      setError(error.message);
      console.error('Failed to enter event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndEvent = async () => {
    if (!wallet.signer) {
      setError('Please connect your wallet first');
      return;
    }
    if (!eventId) {
      setError('Please enter an event ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await endEvent(wallet, eventId);
      setError('Event ended for you!');
    } catch (error: any) {
      setError(error.message);
      console.error('Failed to end event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">NFT Event Ticketing</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <WalletConnect
            wallet={wallet}
            loading={loading}
            onConnect={handleConnect}
          />

          {hasPoap && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              You have received a POAP for this event!
            </div>
          )}

          {wallet.address && (
            <EventActions
              eventId={eventId}
              onEventIdChange={setEventId}
              onBuyTicket={handleBuyTicket}
              onEnterEvent={handleEnterEvent}
              onEndEvent={handleEndEvent}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;