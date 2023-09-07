import {CaptureData} from '../../lib';
import {UserWalletDataResponse} from '../../user-wallet-data';
import {ExpenseCategoryType} from './ExpenseCategoryType';

export interface ExpenseFormType {
  balance: number;
  category: ExpenseCategoryType;
  description: string;
  notes: string;
  wallet: UserWalletDataResponse;
  attachment: CaptureData;
  type: 'EXPENSE';
  created_at: Date;
}
