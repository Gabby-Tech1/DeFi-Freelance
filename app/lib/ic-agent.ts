import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../idl/freelance.did"; // Will point to .did.js

const CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
const LOCAL_HOST = "http://127.0.0.1:8000";

const agent = new HttpAgent({ host: LOCAL_HOST });

if (process.env.NODE_ENV !== "production") {
  agent.fetchRootKey().catch((err) => {
    console.warn("Unable to fetch root key:", err);
  });
}

export const freelanceActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: CANISTER_ID,
});

export async function getFreelanceActor() {
  return freelanceActor;
}