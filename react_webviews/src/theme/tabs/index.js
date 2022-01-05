import baseTypographyConfig, { FONT_WEIGHT } from '../typography';

export const tabsStyleOverRides = (colors={}) => {
  return {
    root: {
      backgroundColor: colors?.supporting?.white,
      minHeight: 36,
    },
    flexContainer: {
      display: 'block !important',
    },
    scrollButtons: {
      '&.Mui-disabled': {
        display: 'none',
      },
    },
  };
};

export const tabStyleOverRides = (colors={},partnerConfig={}) => {
  const typographyVariants = baseTypographyConfig(colors,partnerConfig);
  return {
    root: {
      ...typographyVariants?.body2,
      textTransform: 'none',
      '&.Mui-selected': {
        ...typographyVariants?.body1,
        color: colors?.primary?.brand,
      },
      '&.Mui-disabled': {
        fontWeight: FONT_WEIGHT['Regular'],
        color: colors?.supporting?.athensGrey,
      },
      minHeight: 36,
    },
  };
};
