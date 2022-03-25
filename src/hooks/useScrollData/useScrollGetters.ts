import { ScrollData } from './useScrollDataTypes';

export function getPositionX() {
  return window.pageXOffset || 0;
}

export function getPositionY() {
  return window.pageYOffset || 0;
}

export function getDirectionX(x: number, frameValues: ScrollData): string | null {
  if (x > frameValues.position.x) return 'right';
  if (x < frameValues.position.x) return 'left';
  return null;
}

export function getDirectionY(y: number, frameValues: ScrollData): string | null {
  if (y > frameValues.position.y) return 'down';
  if (y < frameValues.position.y) return 'up';
  return null;
}

export function getTotalDistanceX(x: number, frameValues: ScrollData): number {
  return frameValues.totalDistance.x + Math.abs(x - frameValues.position.x);
}

export function getTotalDistancey(y: number, frameValues: ScrollData): number {
  return frameValues.totalDistance.y + Math.abs(y - frameValues.position.y);
}

export function getRelativelDistanceX(x: number, startValues: ScrollData): number {
  return Math.abs(x - startValues.position.x);
}

export function getRelativelDistanceY(y: number, startValues: ScrollData): number {
  return Math.abs(y - startValues.position.y);
}
