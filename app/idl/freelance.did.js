export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Milestone = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Variant({
      'pending' : IDL.Null,
      'paid' : IDL.Null,
      'completed' : IDL.Null,
    }),
    'title' : IDL.Text,
    'jobId' : IDL.Text,
    'dueDate' : Time,
    'description' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Dispute = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Variant({
      'resolved' : IDL.Null,
      'pending' : IDL.Null,
      'rejected' : IDL.Null,
    }),
    'clientId' : IDL.Principal,
    'createdAt' : Time,
    'jobId' : IDL.Text,
    'resolution' : IDL.Opt(IDL.Text),
    'evidence' : IDL.Text,
    'freelancerId' : IDL.Principal,
    'reason' : IDL.Text,
  });
  const PaymentToken = IDL.Variant({ 'ICP' : IDL.Null, 'ICRC1' : IDL.Text });
  const Job = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Variant({
      'in_progress' : IDL.Null,
      'open' : IDL.Null,
      'completed' : IDL.Null,
    }),
    'experienceLevel' : IDL.Text,
    'title' : IDL.Text,
    'clientId' : IDL.Principal,
    'projectLength' : IDL.Text,
    'description' : IDL.Text,
    'deadline' : Time,
    'category' : IDL.Text,
    'budget' : IDL.Nat,
    'skills' : IDL.Vec(IDL.Text),
  });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'bio' : IDL.Opt(IDL.Text),
    'completedJobs' : IDL.Nat,
    'username' : IDL.Text,
    'createdAt' : Time,
    'hourlyRate' : IDL.Opt(IDL.Nat),
    'totalEarnings' : IDL.Nat,
    'rating' : IDL.Float64,
    'skills' : IDL.Vec(IDL.Text),
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Principal, 'err' : IDL.Text });
  const Proposal = IDL.Record({
    'id' : IDL.Text,
    'bid' : IDL.Nat,
    'status' : IDL.Variant({
      'pending' : IDL.Null,
      'rejected' : IDL.Null,
      'accepted' : IDL.Null,
    }),
    'createdAt' : Time,
    'jobId' : IDL.Text,
    'coverLetter' : IDL.Text,
    'freelancerId' : IDL.Principal,
  });
  const Rating = IDL.Record({
    'id' : IDL.Text,
    'createdAt' : Time,
    'toId' : IDL.Principal,
    'jobId' : IDL.Text,
    'score' : IDL.Float64,
    'comment' : IDL.Text,
    'fromId' : IDL.Principal,
  });
  return IDL.Service({
    'addMilestone' : IDL.Func([Milestone], [Result], []),
    'completeMilestone' : IDL.Func([IDL.Text], [Result_1], []),
    'createDispute' : IDL.Func([Dispute], [Result], []),
    'createEscrow' : IDL.Func([IDL.Text, IDL.Nat, PaymentToken], [Result], []),
    'createJob' : IDL.Func([Job], [Result], []),
    'createMilestoneEscrow' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, PaymentToken],
        [Result],
        [],
      ),
    'createUser' : IDL.Func([User], [Result_2], []),
    'disputeEscrow' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'getJob' : IDL.Func([IDL.Text], [IDL.Opt(Job)], ['query']),
    'getUser' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'listJobs' : IDL.Func([], [IDL.Vec(Job)], ['query']),
    'refundEscrow' : IDL.Func([IDL.Text], [Result_1], []),
    'releaseEscrow' : IDL.Func([IDL.Text], [Result_1], []),
    'releaseMilestoneEscrow' : IDL.Func([IDL.Text], [Result_1], []),
    'releasePayment' : IDL.Func([IDL.Text], [Result_1], []),
    'resolveDispute' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [Result_1], []),
    'submitProposal' : IDL.Func([IDL.Text, Proposal], [Result], []),
    'submitRating' : IDL.Func([Rating], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
