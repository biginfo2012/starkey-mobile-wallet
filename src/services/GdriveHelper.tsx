import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GDrive,
  ListQueryBuilder,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import { t } from 'i18next';
import { showAlert, showToast } from 'theme/Helper/common/Function';
import { ROOT_FOLDER_NAME } from 'theme/Helper/constant';

import FileManagerService from './FileManagerService';

const ROOT_FOLDER_ID = 'root';

const gDriveAccessScopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appfolder',
  'https://www.googleapis.com/auth/drive.appdata',
];

const gdrive = new GDrive();

export const config = async () => {
  GoogleSignin.configure({
    scopes: gDriveAccessScopes,
  });
  await logoutGoogleAccount();
  await loginWithGoogle();
};

export const createFolder = async (folderName: string) => {
  const rootFolder = await retrieveSafeGuardFolderObject();
  // Check if the folder already exists
  if (rootFolder?.files?.length > 0) {
    return;
  }
  // Create the folder
  await gdrive.files
    .newMetadataOnlyUploader()
    .setRequestBody({
      name: folderName,
      mimeType: MimeTypes.FOLDER,
      parents: [ROOT_FOLDER_ID],
    })
    .execute();
};

export const createFiles = async (localPath: string, fileName: string) => {
  await createFolder(ROOT_FOLDER_NAME);
  const rootFolder = await retrieveSafeGuardFolderObject();

  const data = await FileManagerService().readFile(localPath, 'utf8');
  const uploadedFile = await gdrive.files
    .newMultipartUploader()
    .setData(data, MimeTypes.JSON)
    .setRequestBody({
      name: fileName,
      parents: [rootFolder.files[0].id],
    })
    .execute();
  console.log('Done!', uploadedFile);
};

export const readFiles = async () => {
  try {
    const folderData = await retrieveSafeGuardFolderObject();
    if (folderData?.files?.length === 0) {
      throw new Error(t('common:Recovery_Folder_does_not_exist'));
    }
    const folderId = folderData?.files[0].id;

    const res3 = await retrieveFilesInFolderById(folderId);

    const fileData = await gdrive.files.getJson(res3.files[0].id);
    return fileData;
  } catch (error) {
    console.log('readFiles=>>error', error);
    showToast('error', t('common:Recovery_File_does_not_exist'));
  }
};

export const loginWithGoogle = async () => {
  const isUserAlreadyLoggedIn = await GoogleSignin.isSignedIn();
  if (isUserAlreadyLoggedIn) {
    // TODO: document why this block is empty
  } else {
    //Try signInSilently options first if got error then show account selection option to user show user can select account
    try {
      await GoogleSignin.signIn();
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      gdrive.fetchTimeout = 8000;
    } catch (error) {
      showAlert('', t('common:Google_login_failed'));
      throw new Error(t('common:Google_login_failed'));
    }
  }
};

export const logoutGoogleAccount = async () => {
  gdrive.accessToken = null;
  await GoogleSignin.signOut();
};

export async function retrieveFilesInFolderById(folderId: string | number) {
  return await gdrive.files.list({
    q: new ListQueryBuilder().in(folderId, 'parents').and().e('trashed', false),
  });
}

export const retrieveSafeGuardFolderObject = async () => {
  return await gdrive.files.list({
    q: new ListQueryBuilder()
      .in(ROOT_FOLDER_ID, 'parents')
      .and()
      .e('name', ROOT_FOLDER_NAME)
      .and()
      .e('trashed', false),
  });
};
