import { Reducer, Store } from "redux";
import { Diff, applyChange } from "deep-diff";

const UPDATE_EXTERNAL_STORE = `UPDATE_EXTERNAL_STORE_${Math.random() *
  Date.now()}`;
const PATCH_INTERNAL_STORE = `PATCH_INTERNAL_STORE${Math.random() *
  Date.now()}`;

export const updateExternalStore = (payload: object) => ({
  type: UPDATE_EXTERNAL_STORE,
  payload
});

export const patchAction = (payload: Diff<any, any>[]) => ({
  type: PATCH_INTERNAL_STORE,
  payload
});

export const externalReducer: Reducer = (
  state,
  action: ReturnType<typeof updateExternalStore>
) => {
  if (action.type === UPDATE_EXTERNAL_STORE) {
    return { ...action.payload };
  } else {
    return state;
  }
};

export const dirtyReducer: Reducer = (
  state,
  action: ReturnType<typeof patchAction>
) => {
  if (action.type === PATCH_INTERNAL_STORE && action.payload !== undefined) {
    const newState = {
      ...state
    };
    action.payload.forEach(pieceOfDiff => {
      applyChange(newState, {}, pieceOfDiff);
    });
    return newState;
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
