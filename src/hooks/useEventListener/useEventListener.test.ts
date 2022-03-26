import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/native';
import { click } from '@testing-library/user-event/dist/click';

import useEventListener from './useEventListener';

declare global {
  interface WindowEventMap {
    'test-event': CustomEvent;
  }

  interface HTMLElementEventMap {
    'test-event': CustomEvent;
  }
}

const addEventListenerToWindow = jest.fn();
window.addEventListener = addEventListenerToWindow;

const windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = jest.spyOn(window, 'removeEventListener');

const ref = { current: document.createElement('div') };
const refAddEventListenerSpy = jest.spyOn(ref.current, 'addEventListener');
const refRemoveEventListenerSpy = jest.spyOn(ref.current, 'removeEventListener');

describe('useEventListener()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bind the event listener to the window when element is not provided', () => {
    const eventName = 'test-event';

    renderHook(() => useEventListener(eventName, jest.fn()));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());
  });

  it('should bind the event listener to the element when element is provided', () => {
    const eventName = 'test-event';

    renderHook(() => useEventListener(eventName, jest.fn(), ref));

    expect(windowAddEventListenerSpy).not.toHaveBeenCalledWith(eventName, expect.anything());

    expect(refAddEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());
  });

  it('should unbind the event listener from the window after the hook is unmounted', () => {
    const eventName = 'test-event';

    const { unmount } = renderHook(() => useEventListener(eventName, jest.fn()));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());

    unmount();

    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());
  });

  it('should unbind the event listener from the element after the hook is unmounted', () => {
    const eventName = 'test-event';

    const { unmount } = renderHook(() => useEventListener(eventName, jest.fn(), ref));

    expect(refAddEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());

    unmount();

    expect(refRemoveEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());
  });

  it('should call the event listener handler when the event is triggered', () => {
    const refDiv = { current: document.createElement('div') };
    const eventName = 'click';
    const handler = jest.fn();

    renderHook(() => useEventListener(eventName, handler, refDiv));

    fireEvent.click(refDiv.current);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should have the correct event type', () => {
    const refDiv = { current: document.createElement('div') };
    const clickHandler = jest.fn();
    const keydownHandler = jest.fn();

    renderHook(() => useEventListener('click', clickHandler, refDiv));
    renderHook(() => useEventListener('keydown', keydownHandler, refDiv));

    fireEvent.click(refDiv.current);
    fireEvent.keyDown(refDiv.current);

    expect(clickHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(keydownHandler).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });
});
