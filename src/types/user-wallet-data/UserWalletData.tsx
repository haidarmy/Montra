import {BankType} from '../bank-type';

export interface UserWalletData {
  balance: number;
  bank: BankType;
  cardHolderName: string;
}
export interface UserWalletDataResponse extends UserWalletData {
  id: string;
}
