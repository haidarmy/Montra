import {ExpenseFormType, IncomeFormType, TransferFormType} from '../action-menu';

type Form =
  | ExpenseFormType
  | IncomeFormType
  | (TransferFormType & {
      category: 'TRANSFER';
    });
export type TransactionResponse = Form & {id: string; attachment: {name: string; uri: string}};
