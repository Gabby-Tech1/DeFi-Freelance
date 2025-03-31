import { IDL } from '@dfinity/candid';

export const idlFactory = ({ IDL }) => {
  const Job = IDL.Record({
    'id': IDL.Text,
    'title': IDL.Text,
    'description': IDL.Text,
    'budget': IDL.Nat,
    'deadline': IDL.Nat64,
    'clientId': IDL.Text,
    'status': IDL.Variant({
      'open': IDL.Null,
      'in_progress': IDL.Null,
      'completed': IDL.Null,
    }),
    'createdAt': IDL.Nat64,
  });

  const User = IDL.Record({
    'id': IDL.Text,
    'principal': IDL.Principal,
    'username': IDL.Text,
    'bio': IDL.Opt(IDL.Text),
    'rating': IDL.Float64,
  });

  return IDL.Service({
    'createJob': IDL.Func([Job], [IDL.Text], []),
    'getJob': IDL.Func([IDL.Text], [IDL.Opt(Job)], ['query']),
    'listJobs': IDL.Func([], [IDL.Vec(Job)], ['query']),
    'createUser': IDL.Func([User], [IDL.Text], []),
    'getUser': IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
  });
};

export const init = ({ IDL }) => { return []; }; 