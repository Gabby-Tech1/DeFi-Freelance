import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '@/declarations/freelance/freelance.did';

class ICPService {
  private agent: HttpAgent;
  private actor: any;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;

  constructor() {
    this.agent = new HttpAgent({
      host: process.env.NEXT_PUBLIC_IC_HOST || 'https://ic0.app',
    });
  }

  async init() {
    this.authClient = await AuthClient.create();
    if (await this.authClient.isAuthenticated()) {
      const identity = this.authClient.getIdentity();
      this.updateIdentity(identity);
    }
  }

  private updateIdentity(identity: Identity) {
    this.identity = identity;
    this.agent.replaceIdentity(identity);
    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: process.env.NEXT_PUBLIC_FREELANCE_CANISTER_ID!,
    });
  }

  async getIdentity(): Promise<Identity> {
    if (!this.identity) {
      throw new Error('Not authenticated');
    }
    return this.identity;
  }

  async login() {
    if (!this.authClient) {
      throw new Error('AuthClient not initialized');
    }

    await this.authClient.login({
      identityProvider: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL,
      onSuccess: () => {
        const identity = this.authClient!.getIdentity();
        this.updateIdentity(identity);
      },
    });
  }

  async logout() {
    if (this.authClient) {
      await this.authClient.logout();
      this.identity = null;
      this.actor = null;
    }
  }

  // Job Methods
  async createJob(job: any) {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.createJob(job);
  }

  async getJob(id: string) {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.getJob(id);
  }

  async listJobs() {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.listJobs();
  }

  // User Methods
  async createUser(user: any) {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.createUser(user);
  }

  async getUser(principal: Principal) {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.getUser(principal);
  }

  async submitProposal(jobId: string, proposal: any) {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.submitProposal(jobId, proposal);
  }

  // Payment Methods
  async createEscrow(jobId: string, amount: bigint, token: any) {
    if (!this.actor) throw new Error('Not authenticated');
    return this.actor.createEscrow(jobId, amount, token);
  }

  async releaseEscrow(escrowId: string) {
    if (!this.actor) throw new Error('Not authenticated');
    return this.actor.releaseEscrow(escrowId);
  }

  // Milestone Methods
  async createMilestoneEscrow(jobId: string, milestoneId: string, amount: bigint, token: any) {
    if (!this.actor) throw new Error('Not authenticated');
    return this.actor.createMilestoneEscrow(jobId, milestoneId, amount, token);
  }

  async releaseMilestoneEscrow(escrowId: string) {
    if (!this.actor) throw new Error('Not authenticated');
    return this.actor.releaseMilestoneEscrow(escrowId);
  }

  async getEscrowDetails(id: string) {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.getEscrowDetails(id);
  }

  async releaseMilestone(escrowId: string, milestoneId: string) {
    if (!this.actor) throw new Error('Not initialized');
    return this.actor.releaseMilestone(escrowId, milestoneId);
  }
}

export const icpService = new ICPService(); 