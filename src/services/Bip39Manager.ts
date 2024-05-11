import * as bip39 from 'bip39';

const Bip39Manager = () => {
  const createMnemonic = (isTestMode: boolean = false) => {
    // Generate a mnemonic phrase for the user
    let mnemonic = isTestMode
      ? 'faint record mad siren effort before surface strategy return rubber detail dune'
      : bip39.generateMnemonic();
    // Return the mnemonic phrase
    return mnemonic;
  };

  const getSeedUsingMnemonic = (mnemonic: string) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic, ''); // (mnemonic, password)
    return seed;
  };

  const isMnemonicValid = (mnemonic: string) => {
    // Validate mnemonic using BIP39 library
    return bip39.validateMnemonic(mnemonic);
  };

  return {
    createMnemonic,
    getSeedUsingMnemonic,
    isMnemonicValid,
  };
};

export default Bip39Manager;
