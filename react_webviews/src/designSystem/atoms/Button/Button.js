import React from 'react';
import LibButton from '@mui/material/Button';
import DotDotLoaderNew from 'common/ui/DotDotLoaderNew';
import PropTypes from 'prop-types';

const VARIANTS = {
  primary: 'contained',
  secondary: 'text',
  link: 'link',
};

const SIZES = {
  small: 'small',
  large: 'large',
};

const Button = (props) => {
  const {
    size,
    isLoading,
    isInverted,
    variant,
    title,
    disabled,
    color,
    backgroundColor,
    onClick,
    dataAid,
    onHoverStyle,
    ...restProps
  } = props;
  return (
    <LibButton
      isloading={isLoading ? 1 : 0}
      isinverted={isInverted ? 1 : 0}
      variant={VARIANTS[variant] || VARIANTS['primary']}
      size={SIZES[size] || SIZES['large']}
      color='secondary'
      disabled={disabled}
      onClick={onClick}
      data-aid={`button_${dataAid || variant}`}
      sx={{color, backgroundColor,':hover': onHoverStyle}}
      {...restProps}
    >
      {isLoading && variant === 'primary' ? <DotDotLoaderNew /> : <div data-aid='tv_title'>{title}</div>}
    </LibButton>
  );
};

export default Button;

Button.defaultProps = {
  variant: 'primary',
  size: 'large',
  onHoverStyle: {}
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'link']),
  size: PropTypes.oneOf(['small', 'large']),
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isInverted: PropTypes.bool,
  onClick: PropTypes.func,
};
