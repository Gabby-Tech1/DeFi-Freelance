import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/freelance/freelance.did';
import type { _SERVICE } from '../declarations/freelance/freelance.did.d';

const canisterId = process.env.NEXT_PUBLIC_FREELANCE_CANISTER_ID!;

export class ICPService {
  private actor: Actor;

  constructor(identity: Identity) {
    const agent = new HttpAgent({
      identity,
      host: process.env.NEXT_PUBLIC_IC_HOST,
    });

    this.actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId,
    });
  }

  async createJob(job: Job) {
    return this.actor.createJob(job);
  }

  async getJob(id: string) {
    return this.actor.getJob(id);
  }

  async listJobs() {
    return this.actor.listJobs();
  }

  async createUser(user: User) {
    return this.actor.createUser(user);
  }

  async getUser(principal: Principal) {
    return this.actor.getUser(principal);
  }
} 