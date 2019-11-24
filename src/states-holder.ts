import {
  createStore,
  Reducer,
  Store,
  StoreEnhancer
} from "redux";
import { dumpAction } from "./utils";

export class StatesHolder {
  public dirtyStore?: Store;
  public externalStore?: Store;

  public readonly createDirtyStore = (
    reducer: Reducer,
    preloadedState?: any,
    enhancer?: StoreEnhancer
  ) => {
    this.dirtyStore = createStore(
      reducer,
      preloadedState,
      enhancer
    );

    return this.dirtyStore;
  };

  public readonly createExternalStore = (
    reducer: Reducer,
    preloadedState: object = {}
  ) => {
    this.externalStore = createStore(reducer, preloadedState);
    return this.externalStore;
  };

  public readonly forceSyncStores = () => {
    if (this.dirtyStore === undefined || this.externalStore === undefined) {
      throw Error('Stores should be initialized');
    }

    this.externalStore.dispatch(dumpAction(this.dirtyStore.getState()));
  };
}

export const statesHolder = new StatesHolder();
