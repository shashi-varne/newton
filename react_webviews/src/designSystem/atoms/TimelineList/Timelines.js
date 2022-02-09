import React, { Children } from 'react';
import LibTabs from '@mui/material/Tabs';
import LibTab from '@mui/material/Tab';
import PropTypes from 'prop-types';

const indicatorStyles = {
  height: '40px',
  borderRadius: '100%',
};
export const Timelines = ({
  value,
  onChange,
  variant,
  scrollButtons,
  allowScrollButtonsMobile,
  children,
  classes,
  sx,
  dataAid,
  ...props
}) => {
  return (
    <LibTabs
      data-aid={`timelines_${dataAid}`}
      value={value}
      onChange={onChange}
      variant={variant}
      scrollButtons={scrollButtons}
      allowScrollButtonsMobile={allowScrollButtonsMobile}
      classes={classes}
      TabIndicatorProps={{ style: indicatorStyles }}
      sx={sx}
      type='timeline'
      {...props}
    >
      {Children.map(children, (el, idx) => {
        return React.cloneElement(el, { type: 'timeline', idx });
      })}
    </LibTabs>
  );
};

Timelines.defaultProps = {
  variant: 'scrollable',
  scrollButtons: 'auto',
  allowScrollButtonsMobile: true,
};

Timelines.propTypes = {
  variant: PropTypes.oneOf(['fullWidth', 'scrollable', 'standard']),
  scrollButtons: PropTypes.oneOf(['auto', false, true]),
  children: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func,
  allowScrollButtonsMobile: PropTypes.bool,
  dataAid: PropTypes.string,
};

export const TimeLine = ({
  value,
  icon,
  disabled,
  iconPosition,
  label,
  classes,
  sx,
  wrapper,
  idx,
  dataAid,
  ...props
}) => {
  const dataAidValue = dataAid || idx + 1;
  return (
    <LibTab
      data-aid={`timeline_${dataAidValue}`}
      value={value}
      disabled={disabled}
      icon={icon}
      iconPosition={iconPosition}
      label={label}
      classes={classes}
      sx={sx}
      wrapper={wrapper}
      disableRipple
      disableFocusRipple
      disableTouchRipple
      {...props}
    />
  );
};
