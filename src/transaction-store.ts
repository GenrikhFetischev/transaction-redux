import { Store } from "redux";

export default class TransactionStore implements Store {
  constructor(
    private readonly dirtyStore: Store,
    private readonly externalStore: Store
  ) {}

  public readonly dispatch = this.dirtyStore.dispatch;

  public readonly subscribe = this.externalStore.subscribe;

  public readonly getState = this.dirtyStore.getState;

  public readonly replaceReducer = this.dirtyStore.replaceReducer;

  public readonly [Symbol.observable] = this.externalStore[Symbol.observable];
}
