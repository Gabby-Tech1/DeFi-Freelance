import Time "mo:base/Time";

module {
    public type ReputationNFT = {
        id: Text;
        freelancerId: Principal;
        jobId: Text;
        title: Text;
        description: Text;
        rating: Float;
        skills: [Text];
        completionDate: Time.Time;
        clientId: Principal;
        verified: Bool;
    };

    public type StakingPool = {
        id: Text;
        totalStaked: Nat;
        rewardRate: Float;
        stakeholders: [(Principal, Nat)];
        lastUpdateTime: Time.Time;
    };

    public type SponsoredJob = {
        jobId: Text;
        clientId: Principal;
        sponsorshipAmount: Nat;
        startTime: Time.Time;
        endTime: Time.Time;
        featured: Bool;
    };

    public type DisputeVote = {
        disputeId: Text;
        voterId: Principal;
        voteWeight: Nat;
        inFavorOfClient: Bool;
        timestamp: Time.Time;
    };

    // Types
    public type Job = {
        id: Text;
        title: Text;
        description: Text;
        budget: Nat;
        deadline: Time.Time;
        clientId: Principal;
        skills: [Text];
        status: {
            #open;
            #in_progress;
            #completed;
        };
        category: Text;
        experienceLevel: Text;
        projectLength: Text;
    };

    public type User = {
        id: Principal;
        username: Text;
        bio: ?Text;
        skills: [Text];
        rating: Float;
        hourlyRate: ?Nat;
        totalEarnings: Nat;
        completedJobs: Nat;
        createdAt: Time.Time;
    };

    public type Proposal = {
        id: Text;
        jobId: Text;
        freelancerId: Principal;
        coverLetter: Text;
        bid: Nat;
        status: {
            #pending;
            #accepted;
            #rejected;
        };
        createdAt: Time.Time;
    };

    public type Rating = {
        id: Text;
        jobId: Text;
        fromId: Principal;
        toId: Principal;
        score: Float;
        comment: Text;
        createdAt: Time.Time;
    };

    public type Dispute = {
        id: Text;
        jobId: Text;
        clientId: Principal;
        freelancerId: Principal;
        reason: Text;
        evidence: Text;
        status: {
            #pending;
            #resolved;
            #rejected;
        };
        resolution: ?Text;
        createdAt: Time.Time;
    };

    public type Milestone = {
        id: Text;
        jobId: Text;
        title: Text;
        description: Text;
        amount: Nat;
        status: {
            #pending;
            #completed;
            #paid;
        };
        dueDate: Time.Time;
    };

    public type EscrowAccount = {
        id: Text;
        jobId: Text;
        clientId: Principal;
        freelancerId: Principal;
        amount: Nat;
        status: {
            #funded;
            #released;
            #refunded;
            #disputed;
        };
        milestoneId: ?Text;
        createdAt: Time.Time;
    };

    public type PaymentToken = {
        #ICP;
        #ICRC1: Text; // Token canister ID
    };

    public type MilestoneEscrow = {
        id: Text;
        jobId: Text;
        milestoneId: Text;
        clientId: Principal;
        freelancerId: Principal;
        amount: Nat;
        status: {
            #pending;
            #funded;
            #released;
            #disputed;
        };
        token: PaymentToken;
        createdAt: Time.Time;
    };

    public type TokenTransfer = {
        to: Principal;
        amount: Nat;
        token: PaymentToken;
    };

}
