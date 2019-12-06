import { Store } from "redux";
import { TransactionWrapper } from "./transaction-wrapper-creator";

const transactionWrappersHolder = new Map<Store, TransactionWrapper>();

const getTansactionWrapper = (store: Store) =>
  transactionWrappersHolder.get(store);

const setTransactionWrapper = (
  store: Store,
  transactionWrapper: TransactionWrapper
) => transactionWrappersHolder.set(store, transactionWrapper);

export { getTansactionWrapper, setTransactionWrapper };
