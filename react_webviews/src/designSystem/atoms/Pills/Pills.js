import React, { Children } from 'react';
import LibTabs from '@mui/material/Tabs';
import LibTab from '@mui/material/Tab';
import PropTypes from 'prop-types';

const indicatorStyles = (disabled) => {
  return {
    height: '100%',
    borderRadius: 100,
    backgroundColor: disabled ? 'foundationColors.supporting.athensGrey' : ''
  }
}
export const Pills = ({
  value,
  onChange,
  variant,
  scrollButtons,
  allowScrollButtonsMobile,
  children,
  classes,
  disabled,
  sx,
  dataAid,
  ...props
}) => {
  return (
    <LibTabs
      data-aid={`pills_${dataAid}`}
      value={value}
      onChange={onChange}
      variant={variant}
      scrollButtons={scrollButtons}
      allowScrollButtonsMobile={allowScrollButtonsMobile}
      classes={classes}
      TabIndicatorProps={{ sx:indicatorStyles(disabled)}}
      sx={sx}
      {...props}
    >
      {Children.map(children, (el, idx) => {
        return React.cloneElement(el,{type: 'pill', idx});
      })}
    </LibTabs>
  );
};

Pills.defaultProps = {
  variant: 'scrollable',
  scrollButtons: 'auto',
  allowScrollButtonsMobile: true,
};

Pills.propTypes = {
  variant: PropTypes.oneOf(['fullWidth','scrollable','standard']),
  scrollButtons: PropTypes.oneOf(['auto',false, true]),
  children: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func,
  allowScrollButtonsMobile: PropTypes.bool,
  dataAid: PropTypes.string
}

export const Pill = ({
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
      data-aid={`pill_${dataAidValue}`}
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
