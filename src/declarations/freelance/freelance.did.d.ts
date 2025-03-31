import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Dispute {
  'id' : string,
  'status' : { 'resolved' : null } |
    { 'pending' : null } |
    { 'rejected' : null },
  'clientId' : Principal,
  'createdAt' : Time,
  'jobId' : string,
  'resolution' : [] | [string],
  'evidence' : string,
  'freelancerId' : Principal,
  'reason' : string,
}
export interface Job {
  'id' : string,
  'status' : { 'in_progress' : null } |
    { 'open' : null } |
    { 'completed' : null },
  'experienceLevel' : string,
  'title' : string,
  'clientId' : Principal,
  'projectLength' : string,
  'description' : string,
  'deadline' : Time,
  'category' : string,
  'budget' : bigint,
  'skills' : Array<string>,
}
export interface Milestone {
  'id' : string,
  'status' : { 'pending' : null } |
    { 'paid' : null } |
    { 'completed' : null },
  'title' : string,
  'jobId' : string,
  'dueDate' : Time,
  'description' : string,
  'amount' : bigint,
}
export type PaymentToken = { 'ICP' : null } |
  { 'ICRC1' : string };
export interface Proposal {
  'id' : string,
  'bid' : bigint,
  'status' : { 'pending' : null } |
    { 'rejected' : null } |
    { 'accepted' : null },
  'createdAt' : Time,
  'jobId' : string,
  'coverLetter' : string,
  'freelancerId' : Principal,
}
export interface Rating {
  'id' : string,
  'createdAt' : Time,
  'toId' : Principal,
  'jobId' : string,
  'score' : number,
  'comment' : string,
  'fromId' : Principal,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : Principal } |
  { 'err' : string };
export type Time = bigint;
export interface User {
  'id' : Principal,
  'bio' : [] | [string],
  'completedJobs' : bigint,
  'username' : string,
  'createdAt' : Time,
  'hourlyRate' : [] | [bigint],
  'totalEarnings' : bigint,
  'rating' : number,
  'skills' : Array<string>,
}
export interface _SERVICE {
  'addMilestone' : ActorMethod<[Milestone], Result>,
  'completeMilestone' : ActorMethod<[string], Result_1>,
  'createDispute' : ActorMethod<[Dispute], Result>,
  'createEscrow' : ActorMethod<[string, bigint, PaymentToken], Result>,
  'createJob' : ActorMethod<[Job], Result>,
  'createMilestoneEscrow' : ActorMethod<
    [string, string, bigint, PaymentToken],
    Result
  >,
  'createUser' : ActorMethod<[User], Result_2>,
  'disputeEscrow' : ActorMethod<[string, string], Result>,
  'getJob' : ActorMethod<[string], [] | [Job]>,
  'getUser' : ActorMethod<[Principal], [] | [User]>,
  'listJobs' : ActorMethod<[], Array<Job>>,
  'refundEscrow' : ActorMethod<[string], Result_1>,
  'releaseEscrow' : ActorMethod<[string], Result_1>,
  'releaseMilestoneEscrow' : ActorMethod<[string], Result_1>,
  'releasePayment' : ActorMethod<[string], Result_1>,
  'resolveDispute' : ActorMethod<[string, string, boolean], Result_1>,
  'submitProposal' : ActorMethod<[string, Proposal], Result>,
  'submitRating' : ActorMethod<[Rating], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
