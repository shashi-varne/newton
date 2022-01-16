import baseTypographyConfig from '../typography';

export const buttonVariantsConfig = (colors={}, partnerConfig={}) => {
  const typographyVariants = baseTypographyConfig(colors, partnerConfig);
  return [
    {
      props: { variant: 'text' },
      style: {
        ...typographyVariants.actionText,
        color: colors?.action?.brand,
        width: '100%',
        height: '48px',
        borderRadius: partnerConfig?.button?.borderRadius || 10,
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '.MuiTouchRipple-root': {
          color: colors?.supporting?.white
        },
        '&.Mui-disabled': {
          backgroundColor: 'transparent',
          opacity: '0.5',
          color: colors?.action?.brand,
        },
      },
    },
    {
      props: { isloading: 1 },
      style: {
        pointerEvents: 'none',
      },
    },
    {
      props: { size: 'small' },
      style: {
        height: '37px',
        width: 'max-content',
        minWidth: '120px',
        paddingLeft: '16px',
        paddingRight: '16px'
      },
    },
    {
      props: { size: 'large' },
      style: {
        width: '100%',
      },
    },
    {
      props: { variant: 'link' },
      style: {
        ...typographyVariants.body8,
        padding:0,
        margin:0,
        height: 'auto',
        width:'max-content',
        minWidth: 'max-content',
        color: colors?.action?.brand,
        textTransform: 'none',
        '&:hover': {
          color: colors?.action?.brand,
          backgroundColor: 'transparent',
        },
        '.MuiTouchRipple-root': {
          color: 'transparent',
          padding:0,
          margin:0,
        },
        '&.Mui-disabled': {
          backgroundColor: 'transparent',
          opacity: '0.5',
          color: colors?.action?.brand,
        },
      },
    },
    {
      props: { isinverted: 1},
      style: {
        backgroundColor: colors?.supporting?.white,
        color: colors?.action?.brand,
        '&:hover': {
          backgroundColor: colors?.supporting?.grey,
        },
        '.MuiTouchRipple-root': {
          color: colors?.supporting?.white
        },
      },
    },
  ];
}

export const buttonStyleOverRides = (colors={}, partnerConfig={}) => {
  const typographyVariants = baseTypographyConfig(colors, partnerConfig);
  return {
    contained: {
      ...typographyVariants.actionText,
      color: colors?.supporting?.white,
      borderRadius: partnerConfig?.button?.borderRadius || 10,
      height: '48px',
      '&:hover': {
        backgroundColor: partnerConfig?.button?.disableHoverEffect
          ? colors?.action?.brand
          : colors?.action['600'],
      },
    },
    root: {
      '&.Mui-disabled': {
        backgroundColor: partnerConfig?.button?.disabledBackgroundColor || colors?.supporting?.athensGrey,
        color: colors?.supporting?.white,
      },
    },
  };
};
