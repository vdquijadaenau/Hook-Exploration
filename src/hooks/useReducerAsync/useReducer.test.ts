import { renderHook, cleanup, act } from '@testing-library/react-hooks/native';
import { Reducer } from 'react';

import { useReducerAsync, AsyncActionHandlers } from './index';

type State = {
  sleeping: boolean;
};

const initialState: State = {
  sleeping: false,
};

type Action = { type: 'START_SLEEP' } | { type: 'END_SLEEP' } | { type: '' };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'START_SLEEP':
      return { ...state, sleeping: true };
    case 'END_SLEEP':
      return { ...state, sleeping: false };
    default:
      throw new Error('no such action type');
  }
};

type AsyncAction = { type: 'SLEEP'; ms: number };

const asyncActionHandlers: AsyncActionHandlers<Reducer<State, Action>, AsyncAction> = {
  SLEEP:
    ({ dispatch }) =>
    async action => {
      dispatch({ type: 'START_SLEEP' });
      await new Promise(r => {
        setTimeout(r, action.ms);
      });
      dispatch({ type: 'END_SLEEP' });
    },
};

describe('basic spec', () => {
  afterEach(cleanup);

  it(' changes the state with an action', async () => {
    const { result } = renderHook(() =>
      useReducerAsync<Reducer<State, Action>, AsyncAction, AsyncAction | Action>(reducer, initialState, asyncActionHandlers),
    );

    expect(result.current[0].sleeping).toBe(false);

    act(() => {
      result.current[1]({ type: 'START_SLEEP' });
    });

    expect(result.current[0].sleeping).toBe(true);
  });

  it(' throws an error', async () => {
    const { result } = renderHook(() =>
      useReducerAsync<Reducer<State, Action>, AsyncAction, AsyncAction | Action>(reducer, initialState, asyncActionHandlers),
    );
    act(() => {
      result.current[1]({ type: '' });
    });
    expect(result.error?.message).toBe('no such action type');
  });
});
