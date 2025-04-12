import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import ICRC1 "./ICRC1";
import Types "./types";

actor Freelance {
    

    // State
    let selfPrincipal = Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai"); 
    private stable var jobCounter: Nat = 0;
    private var jobs = HashMap.HashMap<Text, Types.Job>(0, Text.equal, Text.hash);
    private var users = HashMap.HashMap<Principal, Types.User>(0, Principal.equal, Principal.hash);
    private var proposals = HashMap.HashMap<Text, Types.Proposal>(0, Text.equal, Text.hash);
    private var ratings = HashMap.HashMap<Text, Types.Rating>(0, Text.equal, Text.hash);
    private var disputes = HashMap.HashMap<Text, Types.Dispute>(0, Text.equal, Text.hash);
    private var milestones = HashMap.HashMap<Text, Types.Milestone>(0, Text.equal, Text.hash);
    private stable var disputeCounter: Nat = 0;
    private var escrowAccounts = HashMap.HashMap<Text, Types.EscrowAccount>(0, Text.equal, Text.hash);
    private stable var escrowCounter: Nat = 0;
    private var milestoneEscrows = HashMap.HashMap<Text, Types.MilestoneEscrow>(0, Text.equal, Text.hash);
    private stable var milestoneEscrowCounter: Nat = 0;
    private var reputationNFTs = HashMap.HashMap<Text, Types.ReputationNFT>(0, Text.equal, Text.hash);
    private var stakingPools = HashMap.HashMap<Text, Types.StakingPool>(0, Text.equal, Text.hash);
    private var sponsoredJobs = HashMap.HashMap<Text, Types.SponsoredJob>(0, Text.equal, Text.hash);
    private var disputeVotes = HashMap.HashMap<Text, [Types.DisputeVote]>(0, Text.equal, Text.hash);

    // Job Management
    public shared(msg) func createJob(job: Types.Job) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        // Validate caller is registered
        switch (users.get(caller)) {
            case null return #err("User not registered");
            case _ {};
        };

        jobCounter += 1;
        let jobId = Int.toText(jobCounter);
        let newJob = {
            id = jobId;
            title = job.title;
            description = job.description;
            budget = job.budget;
            deadline = job.deadline;
            clientId = caller;
            skills = job.skills;
            status = #open;
            category = job.category;
            experienceLevel = job.experienceLevel;
            projectLength = job.projectLength;
        };

        jobs.put(jobId, newJob);
        #ok(jobId)
    };

    public query func getJob(id: Text) : async ?Types.Job {
        jobs.get(id)
    };

    public query func listJobs() : async [Types.Job] {
        Iter.toArray(jobs.vals())
    };


    // User Management
    public shared(msg) func createUser(user: Types.User) : async Result.Result<Principal, Text> {
        let caller = msg.caller;
        
        switch (users.get(caller)) {
            case (?_) return #err("User already exists");
            case null {
                let newUser = {
                    id = caller;
                    username = user.username;
                    bio = user.bio;
                    skills = user.skills;
                    rating = 0.0;
                    hourlyRate = user.hourlyRate;
                    totalEarnings = 0;
                    completedJobs = 0;
                    createdAt = Time.now();
                };
                users.put(caller, newUser);
                #ok(caller)
            };
        }
    };

    public query func getUser(id: Principal) : async ?Types.User {
        users.get(id)
    };

    // Proposal Management
    public shared(msg) func submitProposal(jobId: Text, proposal: Types.Proposal) : async Result.Result<Text, Text> {
        let caller = msg.caller;

        switch (jobs.get(jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (job.status != #open) {
                    return #err("Job is not open for proposals");
                };

                let proposalId = jobId # "-" # Principal.toText(caller);
                let newProposal = {
                    id = proposalId;
                    jobId = jobId;
                    freelancerId = caller;
                    coverLetter = proposal.coverLetter;
                    bid = proposal.bid;
                    status = #pending;
                    createdAt = Time.now();
                };

                proposals.put(proposalId, newProposal);
                #ok(proposalId)
            };
        }
    };

    // Payment System
    public shared(msg) func releasePayment(jobId: Text) : async Result.Result<(), Text> {
        let caller = msg.caller;

        switch (jobs.get(jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (job.clientId != caller) {
                    return #err("Only the client can release payment");
                };
                if (job.status != #completed) {
                    return #err("Job is not completed");
                };

                // Here you would integrate with the ICP ledger
                // For now, we'll just update the freelancer's stats
                switch (proposals.get(jobId # "-" # Principal.toText(job.clientId))) {
                    case null return #err("No proposal found");
                    case (?proposal) {
                        switch (users.get(proposal.freelancerId)) {
                            case null return #err("Freelancer not found");
                            case (?user) {
                                let updatedUser = {
                                    user with
                                    totalEarnings = user.totalEarnings + proposal.bid;
                                    completedJobs = user.completedJobs + 1;
                                };
                                users.put(proposal.freelancerId, updatedUser);
                                #ok(())
                            };
                        };
                    };
                }
            };
        }
    };

    // Rating System
    public shared(msg) func submitRating(rating: Types.Rating) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        // Verify the job exists and is completed
        switch (jobs.get(rating.jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (job.status != #completed) {
                    return #err("Job must be completed before rating");
                };

                // Verify caller is either client or freelancer
                if (caller != job.clientId and caller != rating.toId) {
                    return #err("Unauthorized to submit rating");
                };

                let ratingId = rating.jobId # "-" # Principal.toText(caller);
                ratings.put(ratingId, rating);

                // Update user rating
                switch (users.get(rating.toId)) {
                    case null return #err("User not found");
                    case (?user) {
                        let currentRatings = getAllUserRatings(rating.toId);
                        let newRating = calculateAverageRating(currentRatings);
                        let updatedUser = {
                            user with
                            rating = newRating;
                        };
                        users.put(rating.toId, updatedUser);
                    };
                };

                #ok(ratingId)
            };
        }
    };

    // Dispute System
    public shared(msg) func createDispute(dispute: Types.Dispute) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        switch (jobs.get(dispute.jobId)) {
            case null return #err("Job not found");
            case (?job) {
                // Verify caller is involved in the job
                if (caller != job.clientId and caller != dispute.freelancerId) {
                    return #err("Unauthorized to create dispute");
                };

                disputeCounter += 1;
                let disputeId = dispute.jobId # "-dispute-" # Int.toText(disputeCounter);
                let newDispute = {
                    dispute with
                    id = disputeId;
                    status = #pending;
                    createdAt = Time.now();
                };

                disputes.put(disputeId, newDispute);
                #ok(disputeId)
            };
        }
    };

    public shared(msg) func resolveDispute(disputeId: Text, resolution: Text, accepted: Bool) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        // In a real system, verify caller is an authorized arbitrator
        switch (disputes.get(disputeId)) {
            case null return #err("Dispute not found");
            case (?dispute) {
                if (dispute.status != #pending) {
                    return #err("Dispute is already resolved");
                };

                let updatedDispute = {
                    dispute with
                    status = if (accepted) #resolved else #rejected;
                    resolution = ?resolution;
                };

                disputes.put(disputeId, updatedDispute);

                // If accepted, handle the resolution (e.g., refund or release payment)
                if (accepted) {
                    // Implement resolution logic
                };

                #ok(())
            };
        }
    };

    // Milestone Management
    public shared(msg) func addMilestone(milestone: Types.Milestone) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        switch (jobs.get(milestone.jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (caller != job.clientId) {
                    return #err("Only client can add milestones");
                };

                let milestoneId = milestone.jobId # "-milestone-" # Int.toText(milestones.size());
                let newMilestone = {
                    milestone with
                    id = milestoneId;
                    status = #pending;
                };

                milestones.put(milestoneId, newMilestone);
                #ok(milestoneId)
            };
        }
    };

    public shared(msg) func completeMilestone(milestoneId: Text) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (milestones.get(milestoneId)) {
            case null return #err("Milestone not found");
            case (?milestone) {
                switch (jobs.get(milestone.jobId)) {
                    case null return #err("Job not found");
                    case (?job) {
                        if (caller != job.clientId) {
                            return #err("Only client can complete milestones");
                        };

                        if (milestone.status != #pending) {
                            return #err("Milestone is not pending");
                        };

                        let updatedMilestone = {
                            milestone with
                            status = #completed;
                        };

                        milestones.put(milestoneId, updatedMilestone);
                        #ok(())
                    };
                };
            };
        }
    };

    // Escrow System
    public shared(msg) func createEscrow(jobId: Text, amount: Nat, token: Types.PaymentToken) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        switch (jobs.get(jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (caller != job.clientId) {
                    return #err("Only client can create escrow");
                };

                // Get the accepted proposal
                let proposalId = jobId # "-" # Principal.toText(caller);
                switch (proposals.get(proposalId)) {
                    case null return #err("No accepted proposal found");
                    case (?proposal) {
                        if (proposal.status != #accepted) {
                            return #err("Proposal must be accepted first");
                        };

                        escrowCounter += 1;
                        let escrowId = jobId # "-escrow-" # Int.toText(escrowCounter);
                        
                        // In a real implementation, you would:
                        // 1. Transfer tokens from client to escrow
                        // 2. Verify the transfer
                        // 3. Handle different token types
                        
                        let escrow = {
                            id = escrowId;
                            jobId = jobId;
                            clientId = caller;
                            freelancerId = proposal.freelancerId;
                            amount = amount;
                            status = #funded;
                            milestoneId = null;
                            createdAt = Time.now();
                        };

                        escrowAccounts.put(escrowId, escrow);
                        #ok(escrowId)
                    };
                }
            };
        }
    };

    public shared(msg) func releaseEscrow(escrowId: Text) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (escrowAccounts.get(escrowId)) {
            case null return #err("Escrow not found");
            case (?escrow) {
                if (caller != escrow.clientId) {
                    return #err("Only client can release escrow");
                };
                if (escrow.status != #funded) {
                    return #err("Escrow is not in funded state");
                };

                // In a real implementation:
                // 1. Transfer tokens from escrow to freelancer
                // 2. Verify the transfer
                // 3. Update job and user stats

                let updatedEscrow = {
                    escrow with
                    status = #released;
                };
                escrowAccounts.put(escrowId, updatedEscrow);

                // Update freelancer stats
                switch (users.get(escrow.freelancerId)) {
                    case null return #err("Freelancer not found");
                    case (?user) {
                        let updatedUser = {
                            user with
                            totalEarnings = user.totalEarnings + escrow.amount;
                            completedJobs = user.completedJobs + 1;
                        };
                        users.put(escrow.freelancerId, updatedUser);
                    };
                };

                #ok(())
            };
        }
    };

    public shared(msg) func refundEscrow(escrowId: Text) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (escrowAccounts.get(escrowId)) {
            case null return #err("Escrow not found");
            case (?escrow) {
                if (caller != escrow.clientId) {
                    return #err("Only client can request refund");
                };
                if (escrow.status != #funded) {
                    return #err("Escrow is not in funded state");
                };

                // In a real implementation:
                // 1. Transfer tokens from escrow back to client
                // 2. Verify the transfer
                // 3. Update job status

                let updatedEscrow = {
                    escrow with
                    status = #refunded;
                };
                escrowAccounts.put(escrowId, updatedEscrow);
                #ok(())
            };
        }
    };

    public shared(msg) func disputeEscrow(escrowId: Text, reason: Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        switch (escrowAccounts.get(escrowId)) {
            case null return #err("Escrow not found");
            case (?escrow) {
                if (caller != escrow.clientId and caller != escrow.freelancerId) {
                    return #err("Only involved parties can dispute");
                };
                if (escrow.status != #funded) {
                    return #err("Escrow is not in funded state");
                };

                let updatedEscrow = {
                    escrow with
                    status = #disputed;
                };
                escrowAccounts.put(escrowId, updatedEscrow);

                // Create a dispute case
                disputeCounter += 1;
                let disputeId = escrowId # "-dispute-" # Int.toText(disputeCounter);
                let dispute = {
                    id = disputeId;
                    jobId = escrow.jobId;
                    clientId = escrow.clientId;
                    freelancerId = escrow.freelancerId;
                    reason = reason;
                    evidence = "";
                    status = #pending;
                    resolution = null;
                    createdAt = Time.now();
                };

                disputes.put(disputeId, dispute);
                #ok(disputeId)
            };
        }
    };

    // Milestone Escrow System
    public shared(msg) func createMilestoneEscrow(
        jobId: Text,
        milestoneId: Text,
        amount: Nat,
        token: Types.PaymentToken
    ) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        switch (jobs.get(jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (caller != job.clientId) {
                    return #err("Only client can create escrow");
                };

                switch (milestones.get(milestoneId)) {
                    case null return #err("Milestone not found");
                    case (?milestone) {
                        if (milestone.jobId != jobId) {
                            return #err("Milestone does not belong to this job");
                        };

                        milestoneEscrowCounter += 1;
                        let escrowId = milestoneId # "-escrow-" # Int.toText(milestoneEscrowCounter);

                        // Get the freelancer from the accepted proposal
                        let proposalId = jobId # "-" # Principal.toText(caller);
                        switch (proposals.get(proposalId)) {
                            case null return #err("No accepted proposal found");
                            case (?proposal) {
                                let escrow = {
                                    id = escrowId;
                                    jobId = jobId;
                                    milestoneId = milestoneId;
                                    clientId = caller;
                                    freelancerId = proposal.freelancerId;
                                    amount = amount;
                                    status = #pending;
                                    token = token;
                                    createdAt = Time.now();
                                };

                                // Handle token transfer
                                switch (await transferTokens({
                                    to = selfPrincipal;
                                    amount = amount;
                                    token = token;
                                })) {
                                    case (#err(e)) return #err(e);
                                    case (#ok(_)) {
                                        let updatedEscrow = {
                                            escrow with
                                            status = #funded;
                                        };
                                        milestoneEscrows.put(escrowId, updatedEscrow);
                                        #ok(escrowId)
                                    };
                                }
                            };
                        }
                    };
                }
            };
        }
    };

    public shared(msg) func releaseMilestoneEscrow(escrowId: Text) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (milestoneEscrows.get(escrowId)) {
            case null return #err("Escrow not found");
            case (?escrow) {
                if (caller != escrow.clientId) {
                    return #err("Only client can release escrow");
                };
                if (escrow.status != #funded) {
                    return #err("Escrow is not in funded state");
                };

                // Transfer tokens to freelancer
                switch (await transferTokens({
                    to = escrow.freelancerId;
                    amount = escrow.amount;
                    token = escrow.token;
                })) {
                    case (#err(e)) return #err(e);
                    case (#ok(_)) {
                        let updatedEscrow = {
                            escrow with
                            status = #released;
                        };
                        milestoneEscrows.put(escrowId, updatedEscrow);

                        // Update milestone status
                        switch (milestones.get(escrow.milestoneId)) {
                            case null return #err("Milestone not found");
                            case (?milestone) {
                                let updatedMilestone = {
                                    milestone with
                                    status = #paid;
                                };
                                milestones.put(escrow.milestoneId, updatedMilestone);
                            };
                        };

                        #ok(())
                    };
                }
            };
        }
    };

    // Reputation NFT Management
    public shared(msg) func mintReputationNFT(jobId: Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        switch (jobs.get(jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (job.status != #completed) {
                    return #err("Job must be completed to mint NFT");
                };

                let nftId = jobId # "-nft-" # Principal.toText(caller);
                let nft = {
                    id = nftId;
                    freelancerId = caller;
                    jobId = jobId;
                    title = job.title;
                    description = job.description;
                    rating = 0.0; // Will be updated after client rating
                    skills = job.skills;
                    completionDate = Time.now();
                    clientId = job.clientId;
                    verified = true;
                };

                reputationNFTs.put(nftId, nft);
                #ok(nftId)
            };
        }
    };

    // Staking Management
    public shared(msg) func stake(poolId: Text, amount: Nat) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (stakingPools.get(poolId)) {
            case null return #err("Pool not found");
            case (?pool) {
                // Implement staking logic
                // Transfer tokens from caller to pool
                // Update stakeholder balances
                #ok(())
            };
        }
    };

    // Sponsored Job Management
    public shared(msg) func sponsorJob(jobId: Text, amount: Nat, duration: Int) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (jobs.get(jobId)) {
            case null return #err("Job not found");
            case (?job) {
                if (caller != job.clientId) {
                    return #err("Only job owner can sponsor");
                };

                let sponsored = {
                    jobId = jobId;
                    clientId = caller;
                    sponsorshipAmount = amount;
                    startTime = Time.now();
                    endTime = Time.now() + duration;
                    featured = true;
                };

                sponsoredJobs.put(jobId, sponsored);
                #ok(())
            };
        }
    };

    private func resolveDisputeByVotes(disputeId: Text) : async () {
        switch (disputes.get(disputeId)) {
            case null {};
            case (?dispute) {
                // Update dispute status
                let updatedDispute = { 
                    dispute with 
                    status = #resolved 
                };
                disputes.put(disputeId, updatedDispute);
            };
        };
    };


    // Dispute Resolution
    public shared(msg) func voteOnDispute(disputeId: Text, inFavorOfClient: Bool) : async Result.Result<(), Text> {
        let caller = msg.caller;
        
        switch (disputes.get(disputeId)) {
            case null return #err("Dispute not found");
            case (?dispute) {
                if (dispute.status != #pending) {
                    return #err("Dispute is not pending");
                };

                let vote = {
                    disputeId = disputeId;
                    voterId = caller;
                    voteWeight = 1; // Can be based on reputation/stake
                    inFavorOfClient = inFavorOfClient;
                    timestamp = Time.now();
                };

                // Add vote and check if threshold is reached
                switch (disputeVotes.get(disputeId)) {
                    case null disputeVotes.put(disputeId, [vote]);
                    case (?votes) {
                        let newVotes = Array.append<Types.DisputeVote>(votes, [vote]);
                        disputeVotes.put(disputeId, newVotes);
                        
                        // Check if voting threshold is reached
                        if (newVotes.size() >= 10) { // Minimum votes required
                            await resolveDisputeByVotes(disputeId);
                        };
                    };
                };
                #ok(())
            };
        }
    };

    // Helper functions
     private func getAllUserRatings(userId: Principal) : [Types.Rating] {
        let allRatings = Iter.toArray(ratings.entries());
        Array.filter<Types.Rating>(
            Array.map<(Text, Types.Rating), Types.Rating>(allRatings, func((_, rating)) = rating),
            func (r: Types.Rating) : Bool { r.toId == userId }
        )
    };

    private func calculateAverageRating(ratings: [Types.Rating]) : Float {
        if (ratings.size() == 0) return 0.0;
        
        var total: Float = 0.0;
        for (rating in ratings.vals()) {
            total += rating.score;
        };
        
        total / Float.fromInt(ratings.size())
    };

    // Helper function for token transfers
    private func transferTokens(transfer: Types.TokenTransfer) : async Result.Result<(), Text> {
    switch (transfer.token) {
        case (#ICP) {
            #err("ICP transfers not implemented")
        };
        case (#ICRC1(canisterId)) {
            try {
                let token = actor (canisterId) : ICRC1.Token;
                let result = await token.icrc1_transfer({
                    to = { owner = transfer.to; subaccount = null };
                    amount = transfer.amount;
                    fee = null;
                    memo = null;
                    created_at_time = null;
                });
                switch (result) {
                    case (#Ok(_)) {
                        #ok(())
                    };
                    case (#Err(_)) {
                        #err("Transfer failed with an unspecified error")
                    };
                }
            } catch (e) {
                #err("Failed to transfer tokens: " # Error.message(e))
            }
        };
    }
  };
}