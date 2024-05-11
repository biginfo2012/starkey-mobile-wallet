import { TransactionRequest } from 'ethers';

export type EnvironmentType = 'testNet' | 'mainNet';

export type User = {
  id: number;
  name: string;
};

export interface ExistingNetworksItem {
  [x: string]: string;
  id: string;
  image: string;
  title: string;
  subTitle: string;
  shortName: string;
  amount: string;
  usdAmount: string;
  networkId: string;
  networkName: string;
  tokenType: 'Native' | 'ERC20';
  isUpdated?: boolean;
  tokenContractAddress?: string;
  providerNetworkRPC_URL: string;
  providerNetworkRPC_Network_Name: string | number;
  explorerURL?: string;
  tokenIds?: [string];
  coingeckoTokenId: string;
  oneDayUSDPriceChangePercentage?: number;
  isFavorite?: boolean;
  isEVMNetwork?: boolean;
  tokenGasFeeUnitToDisplay?: string;
  indexerClient?: string;
  isCustom?: boolean; // when we add new network or custom token then we pass true
  envType: EnvironmentType;
  explorerAccountURL: string;
}

export interface ActivityItemInterface {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  functionName: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: string;
  methodId: string;
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  id: string;
  transactionObj: TransactionRequest;
}

export interface UserNameResponse {
  usernameExists: boolean;
}

export interface UserResponse {
  userName: string;
  userId: string;
  privateKey?: string;
  isWalletFromSeedPhase: boolean;
  profileIcon?: string | string[];
  isPrimary: boolean;
}

export interface CreateUserResponse {
  createUser: UserResponse[];
}

export interface UserData {
  userName?: string;
  walletAddress: string;
  network: string;
}

export interface wallets {
  network: string;
  walletAddress: string;
}

export interface UserListResponse {
  getUser: UserResponse[];
}

export interface SolanaTokenListResponseRoot {
  content: SolanaTokenListResponseContent[];
}

export interface SolanaTokenListResponseContent {
  address: string;
  chainId: number;
  decimals: number;
  holders: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: any[];
  verified: boolean;
  balance?: string;
}

// Define a TypeScript model for the account information
interface AccountInfo {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
  // Add any other properties if needed
}

// Define a TypeScript model for the flattened object
export interface FlattenedSolanaCustomTokens {
  [mint: string]: {
    account: {
      data: {
        parsed: {
          info: AccountInfo;
          type: string;
        };
        program: string;
        space: number;
      };
      executable: boolean;
      lamports: number;
      owner: string;
      rentEpoch: number;
      space: number;
    };
    pubkey: string;
  };
}

export type WalletAddressInfo = {
  derivationIndex: string;
  address: string;
};
