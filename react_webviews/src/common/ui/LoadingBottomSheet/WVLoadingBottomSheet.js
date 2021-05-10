/*
 
Use: Bottomsheet with a loader, a timer and some content 

Example syntax:
  <WVLoadingBottomSheet
    isOpen={true} ***required***
    gifSrc={require('assets/ic_verfication_in_progress.gif')}
    timerDuration={10}
    title="Hello World" ***required***
    subtitle="Subtitle text"
    onTimerChange=() => { ... }
    onTimerEnd=() => { ... }
    classes={{
      gif: ''
    }}
  />

*/

// TODO: Move timer into its own component (could help with optimizing re-renders)
import React, { useEffect, useState } from 'react';
import Dialog, { DialogContent } from "material-ui/Dialog";
import { Imgc } from "common/ui/Imgc";
import PropTypes from 'prop-types';
import { isFunction, noop } from 'lodash';

export const WVLoadingBottomSheet = ({
  isOpen,
  gifSrc,
  title,
  subtitle,
  timerDuration, // Sets duration for timer in seconds
  onTimerEnd, // Callback for when timer is stopped
  onTimerChange, // Callback for when timer is ticking
  classes
}) => {
  const [timer, setTimer] = useState(parseInt(timerDuration, 10));
  const timerChangeFunction = isFunction(onTimerChange) ? onTimerChange : noop;

  const updateTimer = (time, timerId) => {
    /* 
      When time is in single digits (<10 secs), prepending a 0
      example: 9 -> 09, 4 -> 04
    */
    setTimer(time < 10 ? `0${time}` : time);    
    timerChangeFunction(time, timerId);
  }

  const startTimer = () => {
    let timerId = '';
    let newTime = timerDuration;

    const countdown = () => {
      newTime -= 1;
      updateTimer(newTime, timerId);
      if (newTime === 0) {
        clearInterval(timerId);
        if (isFunction(onTimerEnd)) {
          onTimerEnd();
        }
      }
    };

    if (timerDuration) {
      timerId = setInterval(countdown, 1000);
    }

    return timerId;
  }

  useEffect(() => {
    const timerId = startTimer();

    return () => clearInterval(timerId);
  }, []);

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="wv-loading-bs"
      keepMounted
      aria-describedby="wv-loading-bs"
      className="wv-loading-bs"
      id="wv-loading-bottom-sheet"
    >
      <DialogContent className="wv-lb-content">
        {gifSrc &&
          <Imgc
            src={gifSrc}
            alt=""
            className={`wv-lbc-gif ${classes.gif}`}
          />
        }
        {title &&
          <div className="wv-lbc-title">
            {title}&nbsp;
            {timerDuration &&
              <span>00:{timer}</span>
            }
          </div>
        }
        {subtitle &&
          <div className="wv-lbc-subtitle">
           {subtitle}
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}

WVLoadingBottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  timerDuration: PropTypes.number,
  onTimerEnd: PropTypes.func,
  onTimerChange: PropTypes.func,
  classes: PropTypes.exact({
    gif: PropTypes.string,
  })
};

WVLoadingBottomSheet.defaultProps = {
  gifSrc: '',
  subtitle: '',
  onTimerEnd: () => {},
  onTimerChange: () => {},
  classes: {}
};