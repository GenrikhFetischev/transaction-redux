import { AnyAction, Reducer, Store } from "redux";
import { createStore, transactionWrapper } from "../src/";
import { ThunkDispatch } from "redux-thunk";

describe("all tests", () => {
  const preloadState = { value: "initial" };
  const reducer: Reducer = (state, action: AnyAction) => ({
    value: action.payload !== undefined ? action.payload : state.value
  });
  const actionCreator = (payload: string): AnyAction => ({
    type: "action",
    payload
  });
  const store = createStore(reducer, preloadState);

  test("preload store value", () => {
    expect(store.getState().value).toBe("initial");
  });

  test("synchronous transaction", async () => {
    const subscriber = jest.fn();
    store.subscribe(subscriber);

    const dispatch = store.dispatch as ThunkDispatch<any, any, any>;

    await dispatch(
      transactionWrapper(dispatch => {
        dispatch(actionCreator("second"));
        expect(store.getState().value).toBe("second");
        dispatch(actionCreator("third"));
      })
    );

    expect(store.getState().value).toBe("third");
    expect(subscriber).toBeCalledTimes(1);
  });
});
