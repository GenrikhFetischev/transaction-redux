import { AnyAction, applyMiddleware, Reducer } from "redux";
import { createStore, getTansactionWrapper } from "../";
import thunk, { ThunkDispatch } from "redux-thunk";

describe("all tests", () => {
  const preloadState = { value: "initial" };
  const reducer: Reducer = (state, action: AnyAction) => ({
    value: action.payload !== undefined ? action.payload : state.value
  });
  const actionCreator = (payload: string): AnyAction => ({
    type: "action",
    payload
  });
  const store = createStore(reducer, preloadState, applyMiddleware(thunk));

  const transactionWrapper = getTansactionWrapper(store);

  test("synchronous transaction", async () => {
    const subscriber = jest.fn();
    store.subscribe(subscriber);

    const dispatch = store.dispatch as ThunkDispatch<any, any, any>;

    await dispatch(
      transactionWrapper(async (dispatch, getState: any) => {
        dispatch(actionCreator("second"));
        expect(getState().value).toBe("second");
        dispatch(actionCreator("third"));
      })
    );

    expect(store.getState().value).toBe("third");
    expect(subscriber).toBeCalledTimes(1);
  });

  test("asynchronous transaction", async () => {
    const subscriber = jest.fn();
    store.subscribe(subscriber);

    const dispatch = store.dispatch as ThunkDispatch<any, any, any>;

    await dispatch(
      transactionWrapper(async (dispatch, getState: any) => {
        await new Promise(resolve => setTimeout(() => resolve(), 10));
        await dispatch(actionCreator("second"));
        expect(getState().value).toBe("second");
        await dispatch(actionCreator("third"));
      })
    );

    expect(store.getState().value).toBe("third");
    expect(subscriber).toBeCalledTimes(1);
  });

  test("complex transaction", async () => {
    const subscriber = jest.fn();
    store.subscribe(subscriber);

    const dispatch = store.dispatch as ThunkDispatch<any, any, any>;

    await dispatch(
      async (
        dispatch: ThunkDispatch<any, any, any>,
        getState: () => typeof preloadState
      ) => {
        const { value } = getState();
        expect(value).toBe("third");

        await dispatch(actionCreator("first"));

        await dispatch(
          transactionWrapper(async dispatch => {
            await dispatch(actionCreator("second"));
            await dispatch(actionCreator("third"));
            await dispatch(actionCreator("fourth"));
          })
        );

        await dispatch(actionCreator("fifth"));
      }
    );

    expect(store.getState().value).toBe("fifth");
    expect(subscriber).toBeCalledTimes(3);
  });
});
