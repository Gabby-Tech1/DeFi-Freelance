"use client";

import { ethers } from 'ethers';

// This is a simplified ABI for an escrow contract
const ESCROW_ABI = [
  "function createEscrow(address freelancer, uint256 amount) external payable returns (uint256)",
  "function releasePayment(uint256 escrowId) external",
  "function refundClient(uint256 escrowId) external",
  "function getEscrow(uint256 escrowId) external view returns (address, address, uint256, uint8)"
];

// Contract address - you would replace this with your deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

class EscrowContract {
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
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, ESCROW_ABI, this.signer);
    }
  }

  async createEscrow(freelancerAddress: string, amount: number): Promise<string | null> {
    if (!this.contract) await this.initContract();
    if (!this.contract) return null;

    try {
      const amountInWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contract.createEscrow(freelancerAddress, amountInWei, {
        value: amountInWei
      });
      const receipt = await tx.wait();
      
      // Extract escrow ID from event logs (this is a simplified example)
      // In a real implementation, you'd parse the event logs to get the escrow ID
      return receipt.transactionHash;
    } catch (error) {
      console.error("Error creating escrow:", error);
      return null;
    }
  }

  async releasePayment(escrowId: string): Promise<boolean> {
    if (!this.contract) await this.initContract();
    if (!this.contract) return false;

    try {
      const tx = await this.contract.releasePayment(escrowId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error releasing payment:", error);
      return false;
    }
  }

  async refundClient(escrowId: string): Promise<boolean> {
    if (!this.contract) await this.initContract();
    if (!this.contract) return false;

    try {
      const tx = await this.contract.refundClient(escrowId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error refunding client:", error);
      return false;
    }
  }

  async getEscrow(escrowId: string): Promise<any> {
    if (!this.contract) await this.initContract();
    if (!this.contract) return null;

    try {
      const escrow = await this.contract.getEscrow(escrowId);
      return {
        client: escrow[0],
        freelancer: escrow[1],
        amount: ethers.utils.formatEther(escrow[2]),
        status: ['Created', 'Funded', 'Completed', 'Refunded', 'Disputed'][escrow[3]]
      };
    } catch (error) {
      console.error("Error getting escrow:", error);
      return null;
    }
  }
}

export const escrowContract = new EscrowContract();