import { Action, DeepPartial, Reducer, Store, StoreEnhancer } from "redux";
import TransactionStore from "./transaction-store";
import { createDumpListener, externalReducer } from "./utils";
import { statesHolder } from "./states-holder";
import { createTransactionWrapper } from "./transaction-wrapper-creator";
import { setTransactionWrapper } from "./transaction-wrappers-holder";

export type StoreCreator = <S, A extends Action, Ext, StateExt>(
  reducer: Reducer<S, A>,
  preloadState?: DeepPartial<S>,
  enhancer?: StoreEnhancer<Ext, StateExt>
) => Store;

export const storeCreator: StoreCreator = (
  reducer,
  preloadState?,
  enhancer?,
  ...rest
) => {
  if (rest.length > 0) {
    throw new Error(
      "It looks like you are passing several store enhancers to " +
        "createStore(). This is not supported. Instead, compose them " +
        "together to a single function."
    );
  }

  const dirtyStore = statesHolder.createDirtyStore(
    reducer,
    preloadState,
    enhancer
  );
  const externalStore = statesHolder.createExternalStore(
    externalReducer,
    preloadState
  );

  dirtyStore.subscribe(createDumpListener(externalStore, dirtyStore));
  statesHolder.forceSyncStores();

  const transactionWrapper = createTransactionWrapper({
    reducer,
    statesHolder
  });

  const transactionStore = new TransactionStore(dirtyStore, externalStore);

  setTransactionWrapper(transactionStore, transactionWrapper);

  return transactionStore;
};
