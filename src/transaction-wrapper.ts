import { TrafficLight } from "./traffic-light";
import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { StatesHolder } from "./states-holder";

export const createTransactionWrapper = (
  trafficLight: TrafficLight,
  statesHolder: StatesHolder
  // eslint-disable-next-line
) => (action: AnyAction | ThunkAction<any, any, any, any>) => async (
  // eslint-disable-next-line
  dispatch: ThunkDispatch<any, any, any>
) => {
  trafficLight.isUpdatesEnabled = false;

  const returnValue = await dispatch(action);
  trafficLight.isUpdatesEnabled = true;

  statesHolder.forceSyncStores();

  return returnValue;
};
