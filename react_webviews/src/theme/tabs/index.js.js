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

export const tabStyleOverRides = (colors={}) => {
  return {
    root: {
      ...baseTypographyConfig()?.body2,
      textTransform: 'none',
      '&.Mui-selected': {
        ...baseTypographyConfig()?.body1,
        color: colors?.primary?.brand,
      },
      '&.Mui-disabled': {
        fontWeight: FONT_WEIGHT['Regular'],
        color: colors?.supporting?.athensGrey,
      },
      '&.Mui-selected': {
        fontWeight: FONT_WEIGHT['Medium'],
      },
      minHeight: 36,
    },
  };
};

export const tabsVariantsConfig = () => {
  return [
    {
      props: { type: 'pills' },
      style: {
        minHeight: 38,
      },
    },
  ];
};

export const tabVariantsConfig = (colors={}) => {
  return [
    {
      props: { type: 'pills' },
      style: {
        zIndex: 2,
        color: colors.primary.brand,
        fontSize: 14,
        fontWeight: FONT_WEIGHT['Regular'],
        minWidth: 76,
        padding: '8px 16px',
        '&.Mui-selected': {
          color: colors.supporting.white,
          fontWeight: FONT_WEIGHT['Medium'],
        },
        '&.Mui-disabled': {
          color: colors.supporting.white,
          backgroundColor: colors.supporting.athensGrey,
          borderRadius: 100,
        },
      },
    },
  ];
};
