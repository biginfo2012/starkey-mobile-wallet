import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import SolanaService from './SolanaService';

describe('SolanaService', () => {
  let mockTokenObj: ExistingNetworksItem;

  beforeEach(() => {
    mockTokenObj = {
      providerNetworkRPC_URL: 'mockRpcUrl',
      tokenContractAddress: 'mockTokenContractAddress',
      providerNetworkRPC_Network_Name: 'mockNetworkName',
      networkName: 'mockNetworkName',
      shortName: 'mockShortName',
      isEVMNetwork: false,
    };
  });

  describe('getBalance', () => {
    it('should return the balance of a specific token associated with a given address', async () => {
      const address = 'mockAddress';
      const balance = await SolanaService().getBalance(address, mockTokenObj);
      expect(balance).toBeDefined();
    });
  });
});
