import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export type WalletType = 'icp' | 'plug' | 'stoic';

interface PlugWindow extends Window {
  ic?: {
    plug?: {
      requestConnect: (args?: {
        whitelist: string[];
        host?: string;
      }) => Promise<boolean>;
      createActor: (args: any) => Promise<any>;
      getPrincipal: () => Promise<Principal>;
      isConnected: () => Promise<boolean>;
    };
  };
}

declare const window: PlugWindow;

export class AuthService {
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private walletType: WalletType | null = null;

  async init() {
    this.authClient = await AuthClient.create();
    if (await this.authClient.isAuthenticated()) {
      this.identity = this.authClient.getIdentity();
      this.walletType = 'icp';
      return true;
    }
    return false;
  }

  private setSession(type: WalletType) {
    document.cookie = `${type}_session=true; path=/; max-age=86400; samesite=lax`;
  }

  private clearSession() {
    document.cookie = `icp_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `wallet_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  async connect(type: WalletType): Promise<Identity> {
    try {
      const identity = await this.getConnectionByType(type);
      this.setSession(type);
      return identity;
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  private async getConnectionByType(type: WalletType): Promise<Identity> {
    switch (type) {
      case 'icp':
        return this.connectICP();
      case 'plug':
        return this.connectPlug();
      case 'stoic':
        return this.connectStoic();
      default:
        throw new Error('Unsupported wallet type');
    }
  }

  private async connectICP(): Promise<Identity> {
    if (!this.authClient) {
      throw new Error('AuthClient not initialized');
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL,
        onSuccess: () => {
          this.identity = this.authClient!.getIdentity();
          this.walletType = 'icp';
          resolve(this.identity);
        },
        onError: reject,
      });
    });
  }

  private async connectPlug(): Promise<Identity> {
    if (!window.ic?.plug) {
      throw new Error('Plug wallet not installed');
    }

    const whitelist = [process.env.NEXT_PUBLIC_FREELANCE_CANISTER_ID!];
    const host = process.env.NEXT_PUBLIC_IC_HOST;

    const connected = await window.ic.plug.requestConnect({ whitelist, host });
    if (!connected) throw new Error('Failed to connect to Plug wallet');

    const principal = await window.ic.plug.getPrincipal();
    this.walletType = 'plug';
    // Get Plug identity
    return window.ic.plug.createActor({
      canisterId: process.env.NEXT_PUBLIC_FREELANCE_CANISTER_ID!,
    });
  }

  private async connectStoic(): Promise<Identity> {
    // Implement Stoic wallet connection
    // You'll need to add the Stoic SDK
    throw new Error('Stoic wallet connection not implemented yet');
  }

  async disconnect(): Promise<void> {
    try {
      switch (this.walletType) {
        case 'icp':
          await this.authClient?.logout();
          break;
        case 'plug':
          // Implement Plug disconnect
          break;
        case 'stoic':
          // Implement Stoic disconnect
          break;
      }
      this.identity = null;
      this.walletType = null;
      this.clearSession();
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getWalletType(): WalletType | null {
    return this.walletType;
  }
}

export const authService = new AuthService();
