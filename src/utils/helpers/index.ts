import { EventType } from '../commonTypes';

export function isEmpty(value : string | object | number) {
  return value === undefined ||
          value === null ||
          (typeof value === 'object' && Object.keys(value).length === 0) ||
          (typeof value === 'string' && value.trim().length === 0);
}

export function isTouchEvent(event?: EventType): event is TouchEvent | React.TouchEvent {
  return !!event && 'changedTouches' in event;
}

// functional definition of MouseEvent
export function isMouseEvent(event?: EventType): event is MouseEvent | React.MouseEvent {
  return !!event && 'clientX' in event;
}

const DEFAULT_POINT = { x: 0, y: 0 };

export function getXAndYFromEvent(event?: EventType) {
  if (!event) return { ...DEFAULT_POINT };

  if (isTouchEvent(event)) {
    return event.changedTouches.length > 0
      ? {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      }
      : { ...DEFAULT_POINT };
  }

  if (isMouseEvent(event)) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }

  // for focus events try to extract the center position of the target element
  const target = event?.target;
  const boundingClientRect =
    target && 'getBoundingClientRect' in target ? target.getBoundingClientRect() : null;

  if (!boundingClientRect) return { ...DEFAULT_POINT };

  return {
    x: boundingClientRect.x + boundingClientRect.width / 2,
    y: boundingClientRect.y + boundingClientRect.height / 2
  };
}


export function localPoint(event: EventType) {
  if (!event) return null;

  const coords = getXAndYFromEvent(event);
  const node = event?.target as Element;
  const rect = node.getBoundingClientRect();

  return ({
    x: coords.x - rect.left - node.clientLeft,
    y: coords.y - rect.top - node.clientTop
  });
}
