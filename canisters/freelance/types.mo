module {
    public type ReputationNFT = {
        id: Text;
        freelancerId: Principal;
        jobId: Text;
        title: Text;
        description: Text;
        rating: Float;
        skills: [Text];
        completionDate: Time;
        clientId: Principal;
        verified: Bool;
    };

    public type StakingPool = {
        id: Text;
        totalStaked: Nat;
        rewardRate: Float;
        stakeholders: [(Principal, Nat)];
        lastUpdateTime: Time;
    };

    public type SponsoredJob = {
        jobId: Text;
        clientId: Principal;
        sponsorshipAmount: Nat;
        startTime: Time;
        endTime: Time;
        featured: Bool;
    };

    public type DisputeVote = {
        disputeId: Text;
        voterId: Principal;
        voteWeight: Nat;
        inFavorOfClient: Bool;
        timestamp: Time;
    };
}
