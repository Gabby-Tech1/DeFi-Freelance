"use client";

import { ethers } from 'ethers';

const DISPUTE_ABI = [
  "function createDispute(string jobId, string reason, string evidence) external returns (uint256)",
  "function voteOnDispute(uint256 disputeId, bool voteForClient) external",
  "function requestMediation(uint256 disputeId) external",
  "function resolveDispute(uint256 disputeId, string resolution) external",
  "function getDispute(uint256 disputeId) external view returns (address, address, string, string, uint8)"
];

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual address

export class DisputeContract {
  private contract: ethers.Contract | null = null;
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initContract();
  }

  private async initContract() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, DISPUTE_ABI, this.signer);
    }
  }

  async createDispute(jobId: string, reason: string, evidence: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.createDispute(jobId, reason, evidence);
    await tx.wait();
    return tx.hash;
  }

  async voteOnDispute(disputeId: string, voteForClient: boolean): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.voteOnDispute(disputeId, voteForClient);
    await tx.wait();
    return tx.hash;
  }

  async requestMediation(disputeId: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.requestMediation(disputeId);
    await tx.wait();
    return tx.hash;
  }

  async resolveDispute(disputeId: string, resolution: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.resolveDispute(disputeId, resolution);
    await tx.wait();
    return tx.hash;
  }
}

export const disputeContract = new DisputeContract(); 