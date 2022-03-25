import { time } from 'console';
import { useState, useRef, useEffect } from 'react';
import { ScrollData, Options } from './useScrollDataTypes';
import { getDirectionX, getDirectionY, getPositionX, getPositionY } from './useScrollGetters';

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

export const useScrollData = (options: Options = {}): ScrollData => {
  const [data, setData] = useState<ScrollData>(INITIAL_STATE);
  const startValues = useRef<ScrollData>(INITIAL_STATE);
  const frameValues = useRef<ScrollData>(INITIAL_STATE);
  const startTimeStamp = useRef<number | null>();
  const frameTimeStampv = useRef<number | null>();
  const scrollTimeout = useRef<any>(null);
  const raf = useRef<any>(null);

  function frame(timestamp: number) {
    if (!startTimeStamp.current) startTimeStamp.current = timestamp;

    const time = timestamp - startTimeStamp.current;
    const position = { x: getPositionX(), y: getPositionY() };

    const directionn = { x: getDirectionX, y: getDirectionY };

    const totalDistance = {
      x: getDirectionX(position.x, frameValues.current),
      y: getDirectionY(position.y, frameValues.current),
    };
  }

  //data to be returned
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
