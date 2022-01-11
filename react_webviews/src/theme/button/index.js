import baseTypographyConfig from '../typography';

export const buttonVariantsConfig = (colors={}, partnerConfig={}) => {
  const typographyVariants = baseTypographyConfig(colors, partnerConfig);
  return [
    {
      props: { size: 'small' },
      style: {
        padding: '8px 16px',
        width: 'max-content',
        minWidth: '120px',
        height: '37px',
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
        width:'max-content',
        color: colors?.action?.brand,
        textTransform: 'none',
        '&:hover': {
          color: colors?.primary?.action,
          backgroundColor: 'transparent',
        },
      },
    },
    {
      props: { variant: 'text' },
      style: {
        ...typographyVariants.actionText,
        color: colors?.action?.brand,
        width: '100%',
        borderRadius: partnerConfig?.button?.borderRadius || 10,
        paddingTop: '13.5px',
        paddingBottom: '13.5px',
      },
    },
    {
      props: { variant: 'text', size: 'small' },
      style: {
        padding: '8px 16px',
        width: 'max-content'
      },
    },
    {
      props: { variant: 'link', size: 'small' },
      style: {
        padding:0,
        margin:0,
        minWidth: 'max-content',
        height: 'auto',
      },
    },
    {
      props: { isloading: 1 },
      style: {
        pointerEvents: 'none',
      },
    },
    {
      props: { isinverted: 1, variant: 'contained'},
      style: {
        backgroundColor: colors.supporting.white,
        color: colors.primary.brand,
        '&:hover': {
          backgroundColor: partnerConfig?.button?.disableHoverEffect
            ? colors?.action?.brand
            : colors?.action['100'],
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
      paddingTop: '13.5px',
      paddingBottom: '13.5px',
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
