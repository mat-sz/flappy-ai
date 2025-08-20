export interface Size {
  w: number;
  h: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point, Size {}

export function rectIntersect(a: Rect, b: Rect) {
  const aLeftOfB = a.x + a.w < b.x;
  const aRightOfB = a.x > b.x + b.w;
  const aAboveB = a.y > b.y + b.h;
  const aBelowB = a.y + a.h < b.y;

  return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
}

export function rectContains(a: Rect, point: Point) {
  return (
    point.x >= a.x &&
    point.x <= a.x + a.w &&
    point.y >= a.y &&
    point.y <= a.y + a.h
  );
}
