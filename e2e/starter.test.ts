import { by, device, expect, element, waitFor } from 'detox';
import { NetWorkType } from 'theme/Helper/constant';

describe('Wallet', () => {
  beforeAll(async () => {
    await device.launchApp({
      delete: false,
    });
    await device.setBiometricEnrollment(true);
  });

  it('should amount send successfully', async () => {
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.matchFace();
    await runSendTokenFlow(
      NetWorkType.SUI,
      '0x7874fe6ef7d945feb202d5b5899f7c076201ca31334f3ade84215054340e2186',
      '0.0001',
    );
    // await runSendTokenFlow(
    //   'ETH',
    //   '0x0510e015BfFf0152f938d06F811fA7612C9F83C9',
    //   '0.00001',
    // );
    // await runSendTokenFlow(
    //   'USDT',
    //   '0x0510e015BfFf0152f938d06F811fA7612C9F83C9',
    //   '0.00001',
    // );
  });

  const runSendTokenFlow = async (
    tokenTitle: string,
    walletAddress: string,
    amount: string,
  ) => {
    await waitFor(element(by.id(tokenTitle)))
      .toBeVisible()
      .withTimeout(3000);
    await element(by.id(tokenTitle)).atIndex(0).tap();
    await element(by.text('Send')).atIndex(0).tap();
    await element(by.text('Next')).atIndex(0).tap();
    await element(by.id('address')).typeText(walletAddress);
    await expect(element(by.text('Next')).atIndex(0)).toBeVisible();
    await element(by.text('Next')).atIndex(0).tap();
    await expect(element(by.text('Next')).atIndex(0)).not.toBeVisible();
    await element(by.id('amount')).typeText(amount);
    await element(by.text('Review transaction')).atIndex(0).tap();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await element(by.text('Send')).atIndex(1).tap();

    //receive-token-modal-button-ok
    await waitFor(element(by.id('receive-token-modal-button-cancel')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('receive-token-modal-button-cancel')).atIndex(0).tap();
    await waitFor(element(by.id('ViewExplorer')))
      .toBeVisible()
      .withTimeout(20000);

    await expect(element(by.id('ViewExplorer')).atIndex(0)).toBeVisible();

    await element(by.id('ViewExplorer')).atIndex(0).tap();

    await element(by.id('left_image')).atIndex(0).tap();
    await element(by.id('left_image')).atIndex(0).tap();
  };
});
