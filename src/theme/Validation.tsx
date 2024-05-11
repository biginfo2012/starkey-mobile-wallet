import { t } from 'i18next';
import * as Yup from 'yup';

import {
  MaximumUsernameCharacters,
  MinimumPrivateKeyCharacters,
  MinimumUsernameCharacters,
} from './Helper/constant';

const validationRegex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  text: /^[A-Za-z\s]+$/,
  number: /^[0-9\s]+$/,
  phoneNumber: /^[0-9\s]+$/,
  userName: RegExp(
    `^(?=[a-zA-Z0-9._]{${MinimumUsernameCharacters},${MaximumUsernameCharacters}}$)(?!.*[_.]{2})[^_.].*[^_.]$`,
  ),
  seed: /^([a-zA-Z]+\s){11}[a-zA-Z]+$/,
  ETHaddress: /^(0x)?[0-9A-Fa-f]{40}$/,
  AptosAddress: /^(0x)?[0-9A-Fa-f]{64}$/,
  url: /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
  maxAllowedDecimalForAmount: /^\d+(\.\d{0,6})?$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{9,24}$/,
};

const createAccount = Yup.object().shape({
  userName: Yup.string()
    .trim()
    .required('onBoarding:enter_username_name')
    .min(MinimumUsernameCharacters, 'onBoarding:enter_valid_username_name')
    .matches(validationRegex.userName, 'onBoarding:enter_valid_username_name'),
  isBlastOffMember: Yup.boolean(),
  email: Yup.string().when('isBlastOffMember', {
    is: true, // alternatively: (val) => val == true
    then: schema =>
      schema
        .required('onBoarding:errorBlankEmail')
        .matches(validationRegex.email, 'onBoarding:enterValidEmail'),
    otherwise: schema => schema.notRequired(),
  }),
});

const createPassword = Yup.object().shape({
  password: Yup.string()
    .trim()
    .required('onBoarding:errorBlankPassword')
    .matches(validationRegex.password, 'onBoarding:errorInvalidPassword'),

  confirmPassword: Yup.string()
    .trim()
    .required('onBoarding:errorBlankConfirmPassword')
    .oneOf([Yup.ref('password')], 'onBoarding:errorPasswordNotMatch'),
});

const password = Yup.object().shape({
  password: Yup.string().trim().required('onBoarding:errorBlankPassword'),
});

const seed = Yup.object().shape({
  seedPhraseOrPrivateKey: Yup.string()
    .trim()
    .required('common:Enter_your_secret_recovery_phrase')
    .matches(validationRegex.seed, 'common:Invalid_seed_phrase'),
});

const walletAddress = Yup.object().shape({
  address: Yup.string()
    .trim()
    .lowercase()
    .required('common:enter_username_or_address'),
  isAddress: Yup.boolean(),
  amount: Yup.number()
    .default(undefined)
    .typeError(t('common:enter_valid_amount'))
    .positive('')
    .test('is-decimal', 'Max 6 decimals allowed!', (val: any) => {
      if (val !== undefined) {
        return validationRegex.maxAllowedDecimalForAmount.test(val);
      }
      return true;
    })
    .when('isAddress', {
      is: true,
      then: schema => schema.required('common:enter_amount'),
      otherwise: schema => schema.notRequired(),
    }),
});

const addCustomToken = Yup.object().shape({
  contractAddress: Yup.string()
    .trim()
    .lowercase()
    .required('wallet:enter_contract_address'),
  symbol: Yup.string().required('wallet:enter_symbol'),
  decimal: Yup.string().required(''),
});

const addNetwork = Yup.object().shape({
  networkUrl: Yup.string().required('wallet:enter_network_url'),
  networkName: Yup.string().trim().required('wallet:enter_network_name'),
});

const privateKey = Yup.object().shape({
  seedPhraseOrPrivateKey: Yup.string()
    .trim()
    .required('onBoarding:enter_private_key')
    .min(MinimumPrivateKeyCharacters, 'onBoarding:invalid_private_key'),
});

const addressBook = Yup.object().shape({
  address: Yup.string().trim().required('setting:enter_address'),
  label: Yup.string().trim().required('setting:enter_label'),
});

export default {
  createAccount,
  seed,
  createPassword,
  password,
  walletAddress,
  addCustomToken,
  validationRegex,
  addNetwork,
  privateKey,
  addressBook,
};
