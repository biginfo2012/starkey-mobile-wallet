import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type MainParamsList = {
  Home: undefined;
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
  Accounts: undefined;
  CreateEditImportAccount: undefined;
  ChooseImportWalletMethod: undefined;
  ImportWallet: undefined;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;
