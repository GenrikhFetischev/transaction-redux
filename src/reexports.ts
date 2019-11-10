import {
  applyMiddleware as originApplyMiddleware,
  Middleware,
  StoreEnhancer
} from "redux";
import thunk from "redux-thunk";

// eslint-disable-next-line
export const applyMiddleware = <Ext, S = any>(
  // eslint-disable-next-line
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: Ext }> =>
  originApplyMiddleware(thunk, ...middlewares);
