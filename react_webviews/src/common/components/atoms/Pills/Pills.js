import React, { Children } from 'react';
import LibTabs from '@mui/material/Tabs';
import LibTab from '@mui/material/Tab';
import PropTypes from 'prop-types';

const indicatorStyles = {
    height: '100%',
    borderRadius: 100
}
export const Pills = ({
  value,
  onChange,
  variant,
  scrollButtons,
  allowScrollButtonsMobile,
  children,
  classes,
  sx,
  ...props
}) => {
  return (
    <LibTabs
      value={value}
      onChange={onChange}
      variant={variant}
      scrollButtons={scrollButtons}
      allowScrollButtonsMobile={allowScrollButtonsMobile}
      classes={classes}
      TabIndicatorProps={{style:indicatorStyles}}
      sx={sx}
      {...props}
    >
      {Children.map(children, (el) => {
        return React.cloneElement(el,{type: 'pills'});
      })}
    </LibTabs>
  );
};

Pills.defaultProps = {
  variant: 'scrollable',
  scrollButtons: 'auto',
  allowScrollButtonsMobile: true,
  children: PropTypes.instanceOf(Array).isRequired,
};

export const Pill = ({
  value,
  icon,
  disabled,
  iconPosition,
  label,
  classes,
  sx,
  wrapper,
  ...props
}) => {
  return (
    <LibTab
      value={value}
      disabled={disabled}
      icon={icon}
      iconPosition={iconPosition}
      label={label}
      classes={classes}
      sx={sx}
      wrapper={wrapper}
      disableRipple
      {...props}
    />
  );
};
