import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action, AnyAction, Reducer, Store } from "redux";
import { diff } from "deep-diff";

import { StatesHolder } from "./states-holder";

export type TransactionWrapper = <R, S, E, A extends Action>(
  action: ThunkAction<R, S, E, A>
) => (dispatch, reduxGetState) => Promise<any>;

export const createTransactionWrapper = ({
  reducer,
  statesHolder
}: {
  reducer: Reducer;
  statesHolder: StatesHolder;
}) => <R, S, E, A extends Action>(action: ThunkAction<R, S, E, A>) => async (
  dispatch,
  reduxGetState
) => {
  let state = reduxGetState();

  const reduxDispatch = dispatch as ThunkDispatch<S, E, A>;

  let error: Error | undefined;
  let returnValue: any;

  const internalDispatch = async <S, E, A extends Action>(
    action: ThunkAction<R, S, E, A> | AnyAction
  ) => {
    if (typeof action === "function") {
      return await internalDispatch(action);
    } else {
      state = reducer(state, action);
      return;
    }
  };

  const getState = () => state;

  try {
    returnValue =
      typeof action === "function"
        ? await action(internalDispatch, getState, {} as any)
        : reduxDispatch(action);
  } catch (e) {
    error = e;
  } finally {
    const patch = diff(reduxGetState(), getState());
    statesHolder.patchStateWithTransactionResult(patch);
  }

  if (error !== undefined) {
    throw error;
  }

  return returnValue;
};
