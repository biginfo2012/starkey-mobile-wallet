import { isValidSuiAddress } from '@mysten/sui.js/utils';
import { PublicKey } from '@solana/web3.js';
import { isAddress } from 'ethers';
import { NetWorkType } from 'theme/Helper/constant';
import { ValidationSchema } from 'theme/index';

const WalletAddressValidationService = () => {
  const checkWalletAddressIsValidOrNot = async (address, networkName) => {
    let isCheckAddressValid = false;
    switch (networkName) {
      case NetWorkType.SUI:
        isCheckAddressValid = isValidSuiAddress(address);
        break;

      case NetWorkType.APT:
      case NetWorkType.SUP:
        isCheckAddressValid =
          address.match(ValidationSchema.validationRegex.AptosAddress) !== null;
        break;

      case NetWorkType.SOL:
        try {
          const publicKey = new PublicKey(address);
          isCheckAddressValid = PublicKey.isOnCurve(publicKey.toBytes());
        } catch (err) {
          isCheckAddressValid = false;
        }
        break;

      default:
        isCheckAddressValid = isAddress(address);
        break;
    }

    return isCheckAddressValid;
  };

  return {
    checkWalletAddressIsValidOrNot,
  };
};

export default WalletAddressValidationService;
