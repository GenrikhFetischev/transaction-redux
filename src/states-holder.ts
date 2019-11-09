import { createStore, Reducer, Store, StoreEnhancer } from "redux";

export class StatesHolder {
  public dirtyStore?: Store;
  public externalStore?: Store;

  createDirtyStore = (
    reducer: Reducer,
    preloadedState: object,
    enhancer?: StoreEnhancer
  ) => {
    this.dirtyStore = createStore(reducer, preloadedState, enhancer);
    return this.dirtyStore;
  };

  createExternalStore = (reducer: Reducer, preloadedState: object = {}) => {
    this.externalStore = createStore(reducer, preloadedState);
    return this.externalStore;
  };
}


export const statesHolder = new StatesHolder();
