import { ethers } from 'ethers';
import type { WalletState } from '../types/wallet';

const CONTRACT_ADDRESS = '0x123...'; // Replace with actual deployed contract address
const CONTRACT_ABI = [
  "function mintTicket(string memory eventId) public payable returns (uint256)",
  "function enterEvent(string memory eventId) public",
  "function endEvent(string memory eventId) public",
  "function hasPoap(address user, string memory eventId) public view returns (bool)",
  "function getUserTicket(address user, string memory eventId) public view returns (uint256)",
  "function getEventId(uint256 tokenId) public view returns (string memory)",
  "event TicketMinted(address indexed recipient, uint256 tokenId, string eventId)",
  "event TicketBurned(address indexed holder, uint256 tokenId, string eventId)",
  "event PoapIssued(address indexed recipient, string eventId)",
  "event EventEnded(address indexed user, string eventId)"
];

export const getContract = (wallet: WalletState) => {
  if (!wallet.provider || !wallet.signer) {
    throw new Error('Wallet not connected');
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet.signer);
};

export const buyTicket = async (wallet: WalletState, eventId: string) => {
  const contract = getContract(wallet);
  const price = ethers.utils.parseEther('0.01');
  
  const tx = await contract.mintTicket(eventId, { value: price });
  await tx.wait();
  return tx;
};

export const enterEvent = async (wallet: WalletState, eventId: string) => {
  const contract = getContract(wallet);
  const tx = await contract.enterEvent(eventId);
  await tx.wait();
  return tx;
};

export const endEvent = async (wallet: WalletState, eventId: string) => {
  const contract = getContract(wallet);
  const tx = await contract.endEvent(eventId);
  await tx.wait();
  return tx;
};

export const checkPoap = async (wallet: WalletState, address: string, eventId: string) => {
  const contract = getContract(wallet);
  return await contract.hasPoap(address, eventId);
};

export const getUserTicket = async (wallet: WalletState, address: string, eventId: string) => {
  const contract = getContract(wallet);
  return await contract.getUserTicket(address, eventId);
};