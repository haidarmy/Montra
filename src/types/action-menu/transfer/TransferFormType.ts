import {CaptureData} from '../../lib';
import {UserWalletDataResponse} from '../../user-wallet-data';

export interface TransferFormType {
  balance: number;
  description: string;
  senderWallet: UserWalletDataResponse;
  receiverWallet: UserWalletDataResponse;
  attachment: CaptureData;
  type: 'TRANSFER';
  created_at: Date;
}
