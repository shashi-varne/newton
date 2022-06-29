import { isFunction } from "lodash-es";
import { useCallback, useRef, useState } from "react";

const useLongPress = (onLongPress, onClick, delay = 500) => {
  const [isLongPressTriggered, setIsLongPressTriggered] = useState(false);
  const timeout = useRef();
  const target = useRef();

  const start = useCallback(
    (event) => {
      if (event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        if (isFunction(onLongPress)) {
          onLongPress(event);
        }
        setIsLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (shouldTriggerClick && !isLongPressTriggered && isFunction(onClick)) {
        onClick();
      }
      setIsLongPressTriggered(false);
      if (target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [onClick, isLongPressTriggered]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
    isLongPressTriggered,
  };
};

const isTouchEvent = (event) => {
  return "touches" in event;
};

const preventDefault = (event) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongPress;
