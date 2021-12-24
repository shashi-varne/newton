import React, { Children } from 'react';
import LibTabs from '@mui/material/Tabs';
import LibTab from '@mui/material/Tab';

export const Tabs = ({
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
      sx={sx}
      {...props}
    >
      {Children.map(children, (el) => {
        return React.cloneElement(el);
      })}
    </LibTabs>
  );
};

Tabs.defaultProps = {
  variant: 'scrollable',
  scrollButtons: 'auto',
  allowScrollButtonsMobile: true,
};

export const Tab = ({
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
      {...props}
    />
  );
};