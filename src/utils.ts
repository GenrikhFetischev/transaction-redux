import { Reducer, Store } from "redux";
import { TrafficLight } from "./traffic-light";

export const dumpAction = (payload: object) => ({
  type: "dump",
  payload
});

export const createDumpReducer = (): Reducer => (
  _state,
  action: ReturnType<typeof dumpAction>
) => ({ ...action.payload });

export const createDumpListener = (
  externalStore: Store,
  dirtyStore: Store,
  trafficLight: TrafficLight
) => () => {
  if (trafficLight.isUpdatesEnabled) {
    externalStore.dispatch(dumpAction(dirtyStore.getState()));
  }
};
