import React, { Children } from 'react';
import LibTabs from '@mui/material/Tabs';
import LibTab from '@mui/material/Tab';
import PropTypes from 'prop-types';

export const Tabs = ({
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
      data-aid={`tabs_${dataAid}`}
      value={value}
      onChange={onChange}
      variant={variant}
      scrollButtons={scrollButtons}
      allowScrollButtonsMobile={allowScrollButtonsMobile}
      classes={classes}
      sx={sx}
      {...props}
    >
      {Children.map(children, (el, idx) => {
        return React.cloneElement(el,{idx});
      })}
    </LibTabs>
  );
};

Tabs.defaultProps = {
  variant: 'scrollable',
  scrollButtons: 'auto',
  allowScrollButtonsMobile: true,
};

Tabs.propTypes = {
  variant: PropTypes.oneOf(['fullWidth','scrollable','standard']),
  scrollButtons: PropTypes.oneOf(['auto',false, true]),
  children: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func,
  allowScrollButtonsMobile: PropTypes.bool,
  dataAid: PropTypes.string
}

export const Tab = ({
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
  const dataAidValue = dataAid || idx;
  return (
    <LibTab
      data-aid={`tab_${dataAidValue}`}
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