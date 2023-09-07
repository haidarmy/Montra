import {CaptureData} from '../../lib';
import {UserWalletDataResponse} from '../../user-wallet-data';
import {IncomeCategoryType} from './IncomeCategoryType';

export interface IncomeFormType {
  balance: number;
  category: IncomeCategoryType;
  description: string;
  notes: string;
  wallet: UserWalletDataResponse;
  attachment: CaptureData;
  type: 'INCOME';
  created_at: Date;
}
