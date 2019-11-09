import { createStoreCreator } from "./create-store";
import { createTransactionWrapper } from "./transaction-wrapper";
import { TrafficLight } from "./traffic-light";
import { statesHolder } from "./states-holder";
export * from "./reexports";

const trafficLight = new TrafficLight();

export const createStore = createStoreCreator(trafficLight);

export const transactionWrapper = createTransactionWrapper(
  trafficLight,
  statesHolder
);
