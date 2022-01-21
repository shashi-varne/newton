import React, { Children } from 'react';
import LibTabs from '@mui/material/Tabs';
import LibTab from '@mui/material/Tab';
import PropTypes from 'prop-types';

const indicatorStyles = {
  height: '40px',
  borderRadius: '100%',
};
export const TimelineList = ({
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
      data-aid={`timelineList_${dataAid}`}
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

TimelineList.defaultProps = {
  variant: 'scrollable',
  scrollButtons: 'auto',
  allowScrollButtonsMobile: true,
};

TimelineList.propTypes = {
  variant: PropTypes.oneOf(['fullWidth', 'scrollable', 'standard']),
  scrollButtons: PropTypes.oneOf(['auto', false, true]),
  children: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func,
  allowScrollButtonsMobile: PropTypes.bool,
  dataAid: PropTypes.string,
};

export const TimeLineItem = ({
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
      data-aid={`timelineItem_${dataAidValue}`}
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
