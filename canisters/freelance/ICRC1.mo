import Principal "mo:base/Principal";

module {
    public type Token = actor {
        icrc1_transfer : shared ({
            to : { owner : Principal; subaccount : ?[Nat8] };
            amount : Nat;
            fee : ?Nat;
            memo : ?[Nat8];
            created_at_time : ?Nat64;
        }) -> async {
            #Ok : Nat;
            #Err : {
                #InsufficientFunds : { balance : Nat };
                #BadFee : { expected_fee : Nat };
                #BadBurn : { min_burn_amount : Nat };
                #Other : Text;
            };
        };
        icrc1_balance_of : shared query ({ owner : Principal; subaccount : ?[Nat8] }) -> async Nat;
    };
} 