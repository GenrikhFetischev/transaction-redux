import { createStore, Reducer, Store, StoreEnhancer } from "redux";
import { updateExternalStore, patchAction, dirtyReducer } from "./utils";
import { Diff } from "deep-diff";

export class StatesHolder {
  public dirtyStore?: Store;
  public externalStore?: Store;

  public readonly createDirtyStore = (
    reducer: Reducer,
    preloadedState?: any,
    enhancer?: StoreEnhancer
  ) => {
    const patchedReducer: Reducer = (state, action) => {
      const updatedState = reducer(state, action);
      return dirtyReducer(updatedState, action);
    };

    this.dirtyStore = createStore(patchedReducer, preloadedState, enhancer);

    return this.dirtyStore;
  };

  public readonly createExternalStore = (
    reducer: Reducer,
    preloadedState: object = {}
  ) => {
    this.externalStore = createStore(reducer, preloadedState);
    return this.externalStore;
  };

  public readonly patchStateWithTransactionResult = (
    patch: Diff<any, any>[]
  ) => {
    this.dirtyStore.dispatch(patchAction(patch));
  };

  public readonly forceSyncStores = () => {
    if (this.dirtyStore === undefined || this.externalStore === undefined) {
      throw Error("Stores should be initialized");
    }

    this.externalStore.dispatch(
      updateExternalStore(this.dirtyStore.getState())
    );
  };
}

export const statesHolder = new StatesHolder();
