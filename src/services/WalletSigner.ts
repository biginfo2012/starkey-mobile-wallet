import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';
import { store } from 'store/index';
import { NetWorkType, defaultNetwork } from 'theme/Helper/constant';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import EthersService from './EthersService';
import SolanaService from './SolanaService';
import SuiService from './SuiService';
import WalletCommonService from './WalletCommonService';

const WalletSigner = () => {
  const signWallet = async (item: ExistingNetworksItem) => {
    let cachedWallet;

    const derivationPathIndex = WalletCommonService().getDerivationPathIndex(
      item.isEVMNetwork ? defaultNetwork : item.networkName,
    );
    switch (item.networkName) {
      case NetWorkType.SUI:
        cachedWallet = SuiService().getKeypairUsingSeed(derivationPathIndex);
        break;

      case NetWorkType.APT:
      case NetWorkType.SUP:
        // Add any specific logic for APT and SUP if needed in the future
        break;

      case NetWorkType.SOL:
        let secretKey: Uint8Array;
        if (store.getState().userInfo.data.currentUser.isWalletFromSeedPhase) {
          const wallet = await SolanaService().getWalletUsingSeed(
            store.getState().wallet.data.seedPhrase,
            derivationPathIndex,
          );
          secretKey = wallet?.secretKey;
        } else {
          secretKey = base58.decode(
            store.getState().userInfo.data.currentUser.privateKey,
          );
        }
        cachedWallet = Keypair.fromSecretKey(secretKey);
        break;

      default:
        if (!cachedWallet) {
          cachedWallet =
            EthersService().getWalletUsingSeed(derivationPathIndex);
        }
        cachedWallet = cachedWallet.connect(
          EthersService().getProvider(
            item?.providerNetworkRPC_URL,
            item?.providerNetworkRPC_Network_Name,
          ),
        );
        break;
    }
    return cachedWallet;
  };

  const signTransaction = async (tx: any, item: ExistingNetworksItem) => {
    let signTransactionObj;

    switch (item.networkName) {
      case NetWorkType.SOL:
        const walletSignerSol = signWallet(item);
        signTransactionObj = await tx.sign(walletSignerSol);
        break;
      // Handle SUP and APT cases if needed in the future
      default:
        const walletSignerEth = await signWallet(item);
        signTransactionObj = await walletSignerEth?.signTransaction(tx);
        break;
    }
    return signTransactionObj;
  };

  return {
    signWallet,
    signTransaction,
  };
};

export default WalletSigner;
