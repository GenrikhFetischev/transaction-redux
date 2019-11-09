import { Action, DeepPartial, Reducer, Store, StoreEnhancer } from "redux";
import TransactionStore from "./transaction-store";
import { createDumpListener, createDumpReducer } from "./utils";
import { TrafficLight } from "./traffic-light";
import { statesHolder } from "./states-holder";

export type StoreCreator = <S, A extends Action, Ext, StateExt>(
  reducer: Reducer<S, A>,
  preloadState: DeepPartial<S>,
  enhancer?: StoreEnhancer<Ext, StateExt>
) => Store;

export const createStoreCreator = (
  trafficLight: TrafficLight
): StoreCreator => (reducer, preloadState, enhancer?) => {
  const dirtyStore = statesHolder.createDirtyStore(
    reducer,
    preloadState,
    enhancer
  );
  const externalStore = statesHolder.createExternalStore(
    createDumpReducer(),
    preloadState
  );

  dirtyStore.subscribe(
    createDumpListener(externalStore, dirtyStore, trafficLight)
  );
  return new TransactionStore(dirtyStore, externalStore);
};
