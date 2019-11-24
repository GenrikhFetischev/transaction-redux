import { TrafficLight } from "./traffic-light";
import { StatesHolder } from "./states-holder";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const createTransactionWrapper = (
  trafficLight: TrafficLight,
  statesHolder: StatesHolder
) => <R, S, E, A extends Action>(action: ThunkAction<R, S, E, A>) => async (
  dispatch: ThunkDispatch<S, E, A>
) => {
  let error: Error | undefined;
  let returnValue: any;
  trafficLight.isUpdatesEnabled = false;

  try {
    returnValue = await dispatch(action);
  } catch (e) {
    error = e;
  } finally {
    trafficLight.isUpdatesEnabled = true;
    statesHolder.forceSyncStores();
  }

  if (error !== undefined) {
    throw error;
  }

  return returnValue;
};
