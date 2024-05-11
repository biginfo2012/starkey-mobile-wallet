import { HDKey } from 'ed25519-keygen/hdkey';
import { t } from 'i18next';
import { showToast } from 'theme/Helper/common/Function';

import Bip39Manager from './Bip39Manager';

const PrivateKeyService = () => {
  const createPrivateKeyUsingSeed = async (
    mnemonic: string,
    pathIndex: string = '0',
  ) => {
    try {
      const seed = Bip39Manager().getSeedUsingMnemonic(mnemonic);
      const hd = HDKey.fromMasterSeed(seed.toString('hex'));
      const path = `m/44'/784'/0'/0'/${pathIndex}'`;
      const privateKey = hd.derive(path).privateKey;
      return privateKey;
    } catch (error: any) {
      showToast('error', t('common:Invalid_seed_phrase'));
      console.log('Failed to createPrivateKeyUsingSeed: ' + error.message);
    }
  };

  return {
    createPrivateKeyUsingSeed,
  };
};

export default PrivateKeyService;
