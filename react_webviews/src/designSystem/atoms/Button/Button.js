import React from 'react';
import LibButton from '@mui/material/Button';
import DotDotLoaderNew from 'common/ui/DotDotLoaderNew';

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
    variant,
    title,
    disabled,
    onClick,
    ...restProps
  } = props;
  return (
    <div>
      <LibButton
        isloading={isLoading}
        variant={VARIANTS[variant] || VARIANTS['primary']}
        size={SIZES[size] || SIZES['large']}
        color='secondary'
        disabled={disabled}
        onClick={onClick}
        {...restProps}
      >
        {isLoading ? <DotDotLoaderNew /> : title}
      </LibButton>
    </div>
  );
};

export default Button;

Button.defaultProps = {
  variant: 'primary',
  size: 'large'
}

Button.propTypes = {
  variant: (props) => validateVariantType(props),
  size: (props) => validateSizeType(props),
};

const validateVariantType = (props) => {
  if (props?.variant && !VARIANTS[props.variant]) {
    console.warn(
      `passed variant: '${props.variant}'\nexpected variants: 'primary', 'secondary', 'link' \n Using 'primary' as default variant`
    );
  }
};

const validateSizeType = (props) => {
  if (props?.size && !SIZES[props.size]) {
    console.warn(
      `passed size: '${props.size}'\nexpected size: 'small', 'large'\n Using 'large' as default size`
    );
  }
};
