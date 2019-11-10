import { createStore, Reducer, Store, StoreEnhancer } from "redux";
import { applyMiddleware } from "./reexports";
import { dumpAction } from "./utils";

export class StatesHolder {
  public dirtyStore?: Store;
  public externalStore?: Store;

  public readonly createDirtyStore = (
    reducer: Reducer,
    preloadedState: object,
    enhancer?: StoreEnhancer
  ) => {
    this.dirtyStore = createStore(
      reducer,
      preloadedState,
      enhancer === undefined ? applyMiddleware() : enhancer
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
    this.externalStore.dispatch(dumpAction(this.dirtyStore.getState()));
  };
}

export const statesHolder = new StatesHolder();
