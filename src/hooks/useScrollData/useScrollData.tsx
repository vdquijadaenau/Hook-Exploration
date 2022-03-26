import { useState, useRef, useEffect } from 'react';

import { ScrollData, Options } from './useScrollDataTypes';
import {
  getDirectionX,
  getDirectionY,
  getPositionX,
  getPositionY,
  getTotalDistanceX,
  getTotalDistanceY,
  getRelativelDistanceX,
  getRelativelDistanceY,
} from './useScrollGetters';

const SCROLL_END_DURATION = 100;

/*
 * Initial State
 */
const INITIAL_STATE: ScrollData = {
  scrolling: false,
  time: 0,
  direction: { x: null, y: null },
  speed: { x: 0, y: 0 },
  totalDistance: { x: 0, y: 0 },
  relativeDistance: { x: 0, y: 0 },
  position: { x: 0, y: 0 },
};

const useScrollData = (options: Options = {}): ScrollData => {
  const [data, setData] = useState<ScrollData>(INITIAL_STATE);
  const startValues = useRef<ScrollData>(INITIAL_STATE);
  const frameValues = useRef<ScrollData>(INITIAL_STATE);
  const startTimeStamp = useRef<number | null>();
  const frameTimeStamp = useRef<number | null>();
  const scrollTimeout = useRef<any>(null);
  const raf = useRef<any>(null);

  /***
   * * Function clearAndSetScrollTimeout
   * * params: timestamp: number
   * * return: void
   */
  function frame(timestamp: number) {
    if (!startTimeStamp.current) startTimeStamp.current = timestamp;

    const time = timestamp - startTimeStamp.current;
    const position = { x: getPositionX(), y: getPositionY() };

    const direction = {
      x: getDirectionX(position.x, frameValues.current),
      y: getDirectionY(position.y, frameValues.current),
    };

    const totalDistance = {
      x: getTotalDistanceX(position.x, frameValues.current),
      y: getTotalDistanceY(position.y, frameValues.current),
    };

    const relativeDistance = {
      x: getRelativelDistanceX(position.x, startValues.current),
      y: getRelativelDistanceY(position.y, startValues.current),
    };

    const timeStampDiff = timestamp - (frameTimeStamp.current || 0);

    const speed = {
      x: (Math.abs(frameValues.current.position.x - position.x) / Math.max(1, timeStampDiff)) * 1000,
      y: (Math.abs(frameValues.current.position.y - position.y) / Math.max(1, timeStampDiff)) * 1000,
    };

    const nextframeValues: ScrollData = {
      ...frameValues.current,
      scrolling: true,
      time,
      direction,
      speed,
      totalDistance,
      relativeDistance,
      position,
    };

    //* New Values

    frameValues.current = nextframeValues;

    //*update the state
    setData(nextframeValues);

    frameTimeStamp.current = timestamp;

    raf.current = requestAnimationFrame(frame);
  }

  /***
   * * Function clearAndSetScrollTimeout
   * * params: void
   * * return: void
   */
  function clearAndSetScrollTimeout(): void {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(scrollEnd, SCROLL_END_DURATION);
  }

  /***
   * * Function onScroll
   * * params: void
   * * return: void
   */
  function onScroll(): void {
    if (!frameValues.current.scrolling) {
      scrollStart();
    }
    clearAndSetScrollTimeout();
  }

  /***
   * * Function scrollStart
   * * params: void
   * * return: void
   */
  function scrollStart(): void {
    //* Save data at mounting
    startValues.current = { ...frameValues.current };
    //*RAF starts
    raf.current = requestAnimationFrame(frame);
    //* if present call function onStart
    if (typeof options.onScrollStart === 'function') {
      options.onScrollStart();
    }
  }

  /***
   * * Function scrollEnd
   * * params: void
   * * return: void
   */
  function scrollEnd() {
    frameValues.current = {
      ...frameValues.current,
      scrolling: false,
      time: 0,
      direction: { x: null, y: null },
      speed: { x: 0, y: 0 },
      totalDistance: { x: 0, y: 0 },
      relativeDistance: { x: 0, y: 0 },
    };

    //* Update State
    setData(frameValues.current);

    //*cancel RAF
    cancelAnimationFrame(raf.current);
    startTimeStamp.current = null;
    frameTimeStamp.current = null;

    //*Call onScrollEnd if present
    if (typeof options.onScrollEnd === 'function') {
      options.onScrollEnd();
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll, true);

    //* Clean up
    return () => {
      clearTimeout(scrollTimeout.current);
      window.removeEventListener('scroll', onScroll, true);
    };
  });
  /*
   *data to be returned
   */
  return {
    ...data,
    time: Math.round(data.time),
    speed: { x: Math.round(data.speed.x), y: Math.round(data.speed.y) },
    totalDistance: {
      x: Math.round(data.totalDistance.x),
      y: Math.round(data.totalDistance.y),
    },
    relativeDistance: {
      x: Math.round(data.relativeDistance.x),
      y: Math.round(data.relativeDistance.y),
    },
    position: {
      x: Math.round(data.position.x),
      y: Math.round(data.position.y),
    },
  };
};

export default useScrollData;
