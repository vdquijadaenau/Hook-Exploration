export type Direction = {
  x: string | null;
  y: string | null;
};

type XYCoordinates = {
  x: number;
  y: number;
};

export type ScrollData = {
  scrolling: boolean;
  time: number;
  direction: Direction;
  speed: XYCoordinates;
  totalDistance: XYCoordinates;
  relativeDistance: XYCoordinates;
  position: XYCoordinates;
};

export type Options = {
  onScrollStart?: Function;
  onScrollEnd?: Function;
};
