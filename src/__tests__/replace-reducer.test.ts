import { createStore, combineReducers } from "..";

// TODO check with redux
describe("replaceReducers test", () => {
  test("returns the original store", () => {
    const nextReducer = combineReducers({
      foo: (state = 1, _action) => state,
      bar: (state = 2, _action) => state
    });
    const store = createStore((state, action) => {
      if (state === undefined) return { type: 5 };
      return action;
    });

    store.replaceReducer(nextReducer);

    expect(store).toBe(store);
  });
});
