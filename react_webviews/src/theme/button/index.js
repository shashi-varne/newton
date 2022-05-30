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
        borderRadius: partnerConfig?.button?.borderRadius || 12,
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
        minWidth: '120px !important'
      },
    },
    {
      props: { size: 'small' },
      style: {
        height: '37px',
        width: 'max-content',
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
      props: { variant: "link", size: "small" },
      style: {
        ...typographyVariants.body2,
        padding: 0,
        margin: 0,
        height: "auto",
        width: "max-content",
        minWidth: "max-content",
        color: colors?.action?.brand,
        textTransform: "none",
        "&:hover": {
          color: colors?.action?.brand,
          backgroundColor: "transparent",
        },
        ".MuiTouchRipple-root": {
          color: "transparent",
          padding: 0,
          margin: 0,
        },
        "&.Mui-disabled": {
          backgroundColor: "transparent",
          opacity: "0.5",
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
    {
      props: { variant: 'outlined' },
      style: {
        ...typographyVariants.actionText,
        color: colors?.action?.brand,
        borderColor: colors?.action?.brand,
        borderRadius: partnerConfig?.button?.borderRadius || 12,
        minHeight: '48px',
        '&:hover': {
          color: colors?.action?.brand,
          backgroundColor: colors?.action[300]
        },
        '&.Mui-disabled': {
          backgroundColor: 'transparent',
          color: colors?.supporting?.athensGrey,
          borderColor: colors?.supporting?.athensGrey,
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
      borderRadius: partnerConfig?.button?.borderRadius || 12,
      minHeight: '48px',
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
