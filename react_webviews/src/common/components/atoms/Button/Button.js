import React from 'react';
import Button from '@mui/material/Button';
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

const RButton = (props) => {
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
      <Button
        isloading={isLoading}
        variant={VARIANTS[variant] || VARIANTS['primary']}
        size={SIZES[size] || SIZES['large']}
        color='secondary'
        disabled={disabled}
        onClick={onClick}
        {...restProps}
      >
        {isLoading ? <DotDotLoaderNew /> : title}
      </Button>
    </div>
  );
};

export default RButton;

RButton.defaultProps = {
  variant: 'primary',
  size: 'large'
}

RButton.propTypes = {
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
