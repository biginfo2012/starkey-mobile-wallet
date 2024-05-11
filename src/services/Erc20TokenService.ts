import axios from 'axios';
import {
  formatErc20Token,
  getWalletAddress,
} from 'theme/Helper/common/Function';
import { Erc20TokenABI } from 'theme/Helper/constant';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';
import { TokenBalanceFormatted } from 'types/applicationInterfaces';

import EthersService from './EthersService';
import WalletSigner from './WalletSigner';

// Constants for ERC20 service
const ERC20_SERVICE_CONSTANTS = {
  WS_PREFIX: 'wss://',
  HTTP_PREFIX: 'https://',
};

// ERC20 Token Service function
const Erc20TokenService = () => {
  // Function to get ERC20 contract
  const getContract = async (
    erc20TokensContractAddress: string,
    item: ExistingNetworksItem,
  ) => {
    // Sign wallet
    const walletSigner = await WalletSigner().signWallet(item);
    // Get and initialize contract using EthersService
    return EthersService().getAndInitContract(
      erc20TokensContractAddress,
      Erc20TokenABI,
      walletSigner,
    );
  };

  // Function to get ERC20 token balance
  const getErc20TokenBalance = async (
    erc20TokensContractAddress: string,
    item: ExistingNetworksItem,
  ): Promise<string> => {
    // Get wallet address
    const walletAddress = getWalletAddress(
      item?.networkName,
      item?.isEVMNetwork,
    );

    try {
      // Get contract
      const contract = await getContract(erc20TokensContractAddress, item);
      // Get balance and decimals
      const balance = await contract.balanceOf(walletAddress);
      const decimal = await contract.decimals();
      // Format token balance
      return formatErc20Token(balance, decimal);
    } catch (error) {
      console.error(
        'Failed to fetch balance Erc20TokenBalance:',
        error.message,
      );
      throw error;
    }
  };

  // Function to fetch ERC20 token balances by network
  const fetchAllErc20TokenBalanceByNetwork = async (
    groupedByNetwork: { [x: string]: any },
    keyName: string,
    item: any[],
  ): Promise<TokenBalanceFormatted[]> => {
    return new Promise(async resolve => {
      try {
        // Initialize variables
        let allTokenBalanceFormattedObjArray: TokenBalanceFormatted[] = [];
        let groupedNetworkValues = groupedByNetwork[keyName];
        let baseURL = groupedNetworkValues[0].providerNetworkRPC_URL.replace(
          ERC20_SERVICE_CONSTANTS.WS_PREFIX,
          ERC20_SERVICE_CONSTANTS.HTTP_PREFIX,
        );

        // Get wallet address
        const address = getWalletAddress(
          groupedNetworkValues[0]?.networkName,
          groupedNetworkValues[0]?.isEVMNetwork,
        );

        // If address doesn't exist, resolve with empty array
        if (!address) {
          resolve([]);
        }

        // Construct request data
        const data = JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          headers: {
            'Content-Type': 'application/json',
          },
          params: [
            `${address}`,
            groupedNetworkValues.map(
              (obj: { tokenContractAddress: any }) => obj.tokenContractAddress,
            ),
          ],
          id: 42,
        });

        // Configure request
        const config = {
          method: 'post',
          url: baseURL,
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        };

        // Send request
        let response = await axios(config);
        response = response?.data;
        const balances = response?.result;

        // Loop through token balances
        for (let token of balances?.tokenBalances) {
          let balance = token.tokenBalance;

          // Fetch token metadata
          const options = {
            method: 'POST',
            url: baseURL,
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
            },
            data: {
              id: 1,
              jsonrpc: '2.0',
              method: 'alchemy_getTokenMetadata',
              params: [token.contractAddress],
            },
          };

          const metadata = await axios.request(options);
          balance =
            balance / Math.pow(10, metadata?.data?.result?.decimals ?? 0);
          balance = balance.toFixed(metadata?.data?.result?.decimals);

          // Push formatted balance to array
          allTokenBalanceFormattedObjArray.push({
            tokenBalance: balance,
            tokenName:
              item.find(
                (obj: { tokenContractAddress: any }) =>
                  obj.tokenContractAddress === token?.contractAddress,
              )?.shortName || '',
          });

          // Resolve if all token balances are fetched
          if (
            allTokenBalanceFormattedObjArray?.length ===
            balances?.tokenBalances?.length
          ) {
            resolve(allTokenBalanceFormattedObjArray);
          }
        }
      } catch (error) {
        resolve([]);
      }
    });
  };

  // Function to fetch all ERC20 token balances
  const fetchAllErc20TokenBalance = (
    item: ExistingNetworksItem[],
  ): Promise<TokenBalanceFormatted[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Initialize variables
        let allTokenBalanceFormattedObjArray: TokenBalanceFormatted[] = [];
        const groupedByNetwork: { [key: string]: ExistingNetworksItem[] } =
          item.reduce(
            (result: { [key: string]: ExistingNetworksItem[] }, obj) => {
              const value = obj.providerNetworkRPC_URL;
              obj.providerNetworkRPC_URL = obj.providerNetworkRPC_URL.replace(
                ERC20_SERVICE_CONSTANTS.WS_PREFIX,
                ERC20_SERVICE_CONSTANTS.HTTP_PREFIX,
              );

              result[value] = result[value] || [];
              result[value].push(obj);
              return result;
            },
            {},
          );

        // Iterate over networks and fetch balances
        for (let keyName in groupedByNetwork) {
          const response = await fetchAllErc20TokenBalanceByNetwork(
            groupedByNetwork,
            keyName,
            item,
          );
          allTokenBalanceFormattedObjArray =
            allTokenBalanceFormattedObjArray.concat(response);

          // Resolve if balances for all networks are fetched
          if (
            Object.keys(groupedByNetwork)[
              Object.keys(groupedByNetwork).length - 1
            ] === keyName
          ) {
            resolve(allTokenBalanceFormattedObjArray);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  // Return public functions
  return {
    getErc20TokenBalance,
    getContract,
    fetchAllErc20TokenBalance,
  };
};

// Export ERC20 Token Service
export default Erc20TokenService;
