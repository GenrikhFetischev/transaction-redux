import { Reducer, Store } from "redux";
import { Diff, applyDiff } from "deep-diff";

export const updateExternalStore = (payload: object) => ({
  type: "full_update",
  payload
});

export const patchAction = (payload: Diff<any, any>[]) => ({
  type: "patch",
  payload
});

export const externalReducer: Reducer = (
  state,
  action: ReturnType<typeof updateExternalStore>
) => {
  if (action.type === "full_update") {
    return { ...action.payload };
  } else {
    return state;
  }
};

export const dirtyReducer: Reducer = (
  state,
  action: ReturnType<typeof patchAction>
) => {
  if (action.type === "patch") {
    debugger
    return applyDiff(state, action.payload);
  } else {
    return state;
  }
};

export const createDumpListener = (
  externalStore: Store,
  dirtyStore: Store
) => () => {
  externalStore.dispatch(updateExternalStore(dirtyStore.getState()));
};
