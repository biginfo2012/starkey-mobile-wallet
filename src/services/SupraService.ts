import { AptosAccount, HexString } from 'aptos';
import { t } from 'i18next';
import nextFrame from 'next-frame';
import { store } from 'store/index';
import * as supraSDK from 'supra-l1-devnet-sdk';
import {
  formatErc20TokenConvertNormal,
  getWalletAddress,
  showToast,
} from 'theme/Helper/common/Function';
import { NetWorkType } from 'theme/Helper/constant';
import {
  ActivityItemInterface,
  ExistingNetworksItem,
} from 'types/apiResponseInterfaces';
import { ActivityRequestType, GasFeeData } from 'types/applicationInterfaces';

import WalletCommonService from './WalletCommonService';

let cachedWallet: any;
let cachedClient: supraSDK.SupraClient;

const SupraService = () => {
  /**
   * Function to retrieve a wallet using a mnemonic seed.
   * @param {string} mnemonic - The mnemonic seed used to derive the wallet.
   * @returns {Promise<Object>} - Returns an object containing the wallet address and private key.
   */
  const getWalletUsingSeed = async (
    mnemonic: string,
    pathIndex: string = '0',
  ) => {
    try {
      if (cachedWallet) {
        return cachedWallet;
      }

      // Disable eslint rule for the next line to prevent unnecessary quotes warning
      // eslint-disable-next-line quotes
      // const derivationPath = `m/44'/637'/0'/0'/0'`;
      const derivationPath = `m/44'/637'/0'/0'/${pathIndex}'`;
      await nextFrame();

      // Derive the account using the provided derivation path and mnemonic
      const account = AptosAccount.fromDerivePath(derivationPath, mnemonic);

      // Convert the account object to a private key object
      const accountObj = account.toPrivateKeyObject();
      const aptosAddress = accountObj.address;
      const privateKey = accountObj.privateKeyHex?.toString();

      // Cache the wallet object and return it
      cachedWallet = { address: aptosAddress, privateKey };
      return cachedWallet;
    } catch (error: any) {
      // Display an error toast and log the error message if an error occurs
      showToast('error', t('common:something_went_wrong_please_try_again'));
      console.log('Failed to fetch wallet AptosService: ' + error.message);
    }
  };

  /**
   * Function to retrieve a wallet using a private key.
   * @param {string} privateKey - The private key used to derive the wallet.
   * @returns {string} - Returns the wallet address derived from the private key.
   */
  const getWalletUsingPrivateKey = (privateKey: string) => {
    try {
      // Convert the private key to bytes
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();

      // Create an Aptos account using the provided private key bytes
      const account = new AptosAccount(privateKeyBytes);

      // Retrieve the wallet address from the account
      const aptosAddress = account.address().toString();

      return aptosAddress;
    } catch (error: any) {
      showToast('error', t('onBoarding:invalid_private_key'));
      console.log('getWalletUsingPrivateKey error: ' + error.message);
      return '';
    }
  };

  const getPrivateKeyUsingSeedPhrase = (pathIndex: string = '0') => {
    const derivationPath = `m/44'/637'/0'/0'/${pathIndex}'`;
    // Derive the account using the provided derivation path and mnemonic
    const account = AptosAccount.fromDerivePath(
      derivationPath,
      store.getState().wallet.data.seedPhrase,
    );
    // Convert the account object to a private key object
    const accountObj = account.toPrivateKeyObject();
    const privateKey = accountObj.privateKeyHex?.toString();
    return privateKey;
  };

  /**
   * Function to create a provider using the provided URL.
   * If the cached client node URL does not match the provided URL, a new AptosClient is created and cached.
   * @param {string} url - The URL used to create the provider.
   * @returns {AptosClient} - Returns the created or cached AptosClient.
   */
  const createProvider = async (url: string) => {
    // Check if the cached client node URL matches the provided URL
    if (cachedClient?.supraNodeURL !== url) {
      // If the URLs don't match, create a new AptosClient with the provided URL and cache it
      cachedClient = await supraSDK.SupraClient.init(
        cachedClient?.supraNodeURL ?? url,
      );
    }
    return cachedClient;
  };

  /**
   * Function to retrieve a provider based on the information from an ExistingNetworksItem.
   * The function uses the createProvider function to create or return a cached AptosClient based on the provided URL.
   * @param {ExistingNetworksItem} item - The item containing network information.
   * @returns {AptosClient} - Returns the created or cached AptosClient based on the provided network URL.
   */
  const getProvider = async (item: ExistingNetworksItem) => {
    return await createProvider(item?.providerNetworkRPC_URL);
  };

  /**
   * Function to retrieve the private key from the Redux store.
   * If the wallet is derived from a seed phase, it calls getWalletUsingSeed to retrieve the private key.
   * Otherwise, it retrieves the private key directly from the Redux store.
   * @returns {Promise<string>} - Returns the retrieved private key.
   */
  const getPrivateKey = async () => {
    let privateKey = '';

    const { isWalletFromSeedPhase } =
      store.getState().userInfo.data.currentUser;

    // Check if the wallet is from the seed phase
    if (isWalletFromSeedPhase) {
      // If the wallet is from the seed phase, retrieve the private key using getWalletUsingSeed
      const account = await getWalletUsingSeed(
        store.getState().wallet.data.seedPhrase,
        WalletCommonService().getDerivationPathIndex(NetWorkType.SUP),
      );
      privateKey = account.privateKey;
    } else {
      // If the wallet is not from the seed phase, retrieve the private key from the Redux store
      privateKey = store.getState().userInfo.data.currentUser.privateKey;
    }
    return privateKey;
  };

  /**
   * Function to retrieve the balance for a specific token using the provided token object.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   * @returns {Promise<string>} - Returns a promise that resolves to the token balance as a string.
   */
  const getBalance = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<string> => {
    try {
      // Retrieve the provider using the provided token object
      const client = await getProvider(tokenObj);

      const oldUserWalletAddress = getWalletAddress(
        tokenObj.networkName,
        tokenObj.isEVMNetwork,
      );

      const balance = await client.getAccountSupraCoinBalance(
        new HexString(oldUserWalletAddress),
      );

      const currentUserWalletAddress = getWalletAddress(
        tokenObj.networkName,
        tokenObj.isEVMNetwork,
      );

      if (currentUserWalletAddress === oldUserWalletAddress) {
        return balance?.toString() ?? '0';
      } else {
        return '0';
      }
      // Return the balance as a string, or '0' if no balance is found
    } catch (error: any) {
      console.log('error', error);
      // Return '0' if an error occurs during the balance retrieval
      return '0';
    }
  };

  /**
   * Function to retrieve the balance of another user using the provided address and token object.
   * @param {string} address - The address of the user whose balance is to be retrieved.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   * @returns {Promise<string>} - Returns a promise that resolves to the balance of the specified user as a string.
   */
  const getOtherUserBalance = async (
    address: string,
    tokenObj: ExistingNetworksItem,
  ): Promise<string> => {
    try {
      // Retrieve the provider using the provided token object
      const client = await getProvider(tokenObj);

      // Retrieve the balance from the account resource data
      const balance = await client.getAccountSupraCoinBalance(
        new HexString(address),
      );

      // Return the balance as a string
      return balance.toString();
    } catch (error: any) {
      console.log('E', error);
      // Return '0' if an error occurs during the balance retrieval
      return '0';
    }
  };

  /**
   * Function to send Aptos coins to a specified address.
   * @param {string} toAddress - The recipient's address for the transaction.
   * @param {string} amount - The amount of Aptos coins to send.
   * @param {number} _gasPrice - The gas price for the transaction.
   * @param {number} _gasLimit - The gas limit for the transaction.
   * @param {Function} onTransactionRequest - Callback function executed when the transaction request is made.
   * @param {Function} onTransactionDone - Callback function executed when the transaction is successful.
   * @param {Function} onTransactionFail - Callback function executed when the transaction fails.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   */
  const sendNativeToken = async (
    toAddress: string,
    amount: string,
    _gasPrice: number,
    _gasLimit: number,
    onTransactionRequest: (request?: {}) => void,
    onTransactionDone: (transaction: {}) => void,
    onTransactionFail: (transaction: {}) => void,
    tokenObj: ExistingNetworksItem,
  ) => {
    try {
      // Retrieve the private key using the getPrivateKey function
      const privateKey = await getPrivateKey();
      // Convert the private key to bytes
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();
      // Create an Aptos account using the private key bytes
      const myAccount = new AptosAccount(privateKeyBytes);
      // Retrieve the provider using the provided token object
      const client = await getProvider(tokenObj);
      let receiveAccount = new HexString(toAddress);
      onTransactionRequest({});
      const transactions = await client.transferSupraCoin(
        myAccount,
        receiveAccount,
        BigInt(formatErc20TokenConvertNormal(Number(amount), 6)),
      );
      // Execute the onTransactionRequest callback
      // Wait for the transaction result using the client's waitForTransactionWithResult
      // Check if the transaction is successful and execute the corresponding
      if (transactions?.result === 'Success') {
        onTransactionDone({
          gasPrice: 21000,
          hash: transactions?.txHash,
          status: '1',
          gasUsed: 100,
        });
        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        onTransactionFail(
          t('onBoarding:something_went_wrong_please_try_again'),
        );
      }
    } catch (error: any) {
      // Log the error and execute the onTransactionFail callback
      console.log('error/>>?>>>?????', error);
      onTransactionFail(t('onBoarding:something_went_wrong_please_try_again'));
    }
  };

  /**
   * Function to retrieve gas fee data for transactions.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   * @returns {Promise<GasFeeData>} - Returns a promise that resolves to an object containing gas fee data.
   */
  const getFeeData = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<GasFeeData> => {
    try {
      // Retrieve the provider using the provided token object
      const client = await getProvider(tokenObj);
      const gasPrice = await client.getGasPrice();
      return {
        gasPrice: gasPrice.toString(),
        maxFeePerGas: '',
        maxPriorityFeePerGas: '',
        gasUsed: '6',
      };
    } catch (error) {
      // Log the error if it occurs and return empty gas fee data
      throw {
        gasPrice: 0,
        maxFeePerGas: 0,
        maxPriorityFeePerGas: 0,
        gasUsed: 0,
      };
    }
  };

  const collectTokenFromFaucet = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      // Retrieve the provider using the provided token object
      const client = await getProvider(tokenObj);

      const walletAddress = getWalletAddress(
        tokenObj.networkName,
        tokenObj.isEVMNetwork,
      );
      const success = await client.fundAccountWithFaucet(
        new HexString(walletAddress),
      );
      return {
        success: success,
        error: null,
      };
    } catch (error) {
      // Log the error if it occurs and return data
      throw {
        success: false,
        error: 'failed!',
      };
    }
  };

  /**
   * Function to retrieve the token activity list for a specific wallet address.
   * @param {ActivityRequestType} - An object containing the wallet address, transaction type, page, and token information.
   * @returns {Promise<any>} - Returns a promise that resolves to an object containing the token activity list.
   */
  const getTokenActivityListByAddress = async ({
    walletAddress,
    txtType,
    _page,
    tokenInfo,
  }: ActivityRequestType): Promise<any> => {
    try {
      // Retrieve the provider using the provided token information
      const client = await getProvider(tokenInfo);

      const transactionBlocks = await client.getSupraTransferHistory(
        new HexString(walletAddress),
        15,
      );

      let transactions = [];

      for (const obj of transactionBlocks) {
        const tx: ActivityItemInterface = {
          blockHash: '',
          blockNumber: '',
          confirmations: '',
          contractAddress: '',
          cumulativeGasUsed: '',
          from: '0x' + obj?.sender ?? '',
          functionName: '',
          gas: '',
          gasPrice: obj?.gasUnitPrice.toString() ?? '0',
          gasUsed: '',
          hash: obj?.txHash,
          input: '',
          isError: '',
          methodId: '',
          nonce: '',
          timeStamp:
            (Number(obj?.txConfirmationTime ?? 0) / 1000000)?.toString() ?? '',
          to: '0x' + obj?.receiver ?? '',
          transactionIndex: '',
          txreceipt_status: '1',
          value: obj.amount.toString(),
          tokenDecimal: '6',
          tokenName: '',
          tokenSymbol: '',
        };
        transactions.push(tx);
      }
      // Return the filtered data and a boolean indicating if the token is native
      return {
        data: transactions,
        isNativeToken: txtType === NetWorkType.SUP ? true : false,
      };
    } catch (error) {
      // Log the error if it occurs and return an empty data object with a default isNativeToken value
      console.log('transactionBlocks error', error);
      return { data: [], isNativeToken: true };
    }
  };

  /**
   * Function to retrieve token transaction details based on the transaction type and hash.
   * @param {ActivityRequestType} - An object containing the transaction type, token information, and hash.
   * @returns {Promise<any>} - Returns a promise that resolves to an array containing the transaction details.
   */
  async function getTokenTransactionDetails({
    _txtType,
    tokenInfo,
    hash,
  }: ActivityRequestType): Promise<any> {
    try {
      // Retrieve the provider using the provided token information
      const client = await getProvider(tokenInfo);

      // Retrieve the transaction using the client and the provided hash
      const transactionInfo = await client.getTransactionDetail(hash);
      const tx: ActivityItemInterface = {
        blockHash: '',
        blockNumber: '',
        confirmations: '',
        contractAddress: '',
        cumulativeGasUsed: '',
        from: '0x' + transactionInfo?.sender ?? '',
        functionName: '',
        gas: transactionInfo?.gas?.toString() ?? '0',
        gasPrice: transactionInfo?.gasUnitPrice.toString() ?? '0',
        gasUsed: transactionInfo?.gasUsed.toString() ?? '0',
        hash: hash,
        input: '',
        isError: '',
        methodId: '',
        nonce: '',
        timeStamp:
          (
            Number(transactionInfo?.txConfirmationTime ?? 0) / 1000000
          )?.toString() ?? '',
        to: '0x' + transactionInfo?.receiver ?? '',
        transactionIndex: '',
        txreceipt_status: '1',
        value: transactionInfo.amount.toString(),
        tokenDecimal: '6',
        tokenName: '',
        tokenSymbol: '',
      };
      return [tx];
    } catch (error) {
      // Log the error if it occurs and return an empty array
      console.log('error', error);
      return [];
    }
  }

  /**
   * Function to reset the wallet by setting the cachedWallet to null.
   */
  const resetWallet = () => {
    cachedWallet = null;
  };

  //TODO: this feature will be added later on.
  const sendCustomToken = () => {};

  //TODO: this feature will be added later on.
  const getCustomTokenInformation = () => {};

  const checkAccountIsExist = async (
    tokenObj: ExistingNetworksItem,
    walletAddress: string,
  ) => {
    try {
      // Retrieve the provider using the provided token object
      const client = await getProvider(tokenObj);
      const isExists = await client.isAccountExists(
        new HexString(walletAddress),
      );
      return isExists;
    } catch (error) {
      return false;
    }
  };

  return {
    getWalletUsingSeed,
    getBalance,
    sendNativeToken,
    getFeeData,
    getTokenActivityListByAddress,
    getTokenTransactionDetails,
    getProvider,
    getWalletUsingPrivateKey,
    getOtherUserBalance,
    resetWallet,
    getPrivateKeyUsingSeedPhrase,
    sendCustomToken,
    getCustomTokenInformation,
    collectTokenFromFaucet,
    checkAccountIsExist,
  };
};

export default SupraService;
