import baseTypographyConfig, { FONT_WEIGHT } from '../typography';

export const tabsStyleOverRides = () => {
  return {
    root: {
      backgroundColor: 'transparent',
      minHeight: 36,
    },
    flexContainer: {
      display: 'block !important',
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

export const tabsVariantsConfig = () => {
  return [
    {
      props: { type: 'pill' },
      style: {
        minHeight: 38,
      },
    },
  ];
};

export const tabVariantsConfig = (colors={},partnerConfig={}) => {
  const typographyVariants = baseTypographyConfig(colors,partnerConfig);
  return [
    {
      props: { type: 'pill' },
      style: {
        zIndex: 2,
        ...typographyVariants?.body2,
        color: colors.primary.brand,
        minWidth: 'fit-content',
        padding: '8px 16px',
        '&.Mui-selected': {
          ...typographyVariants?.body1,
          color: colors.supporting.white,
        },
        '&.Mui-disabled': {
          ...typographyVariants?.body1,
          color: colors.supporting.white,
          backgroundColor: colors.supporting.athensGrey,
        },
        borderRadius: 100,
      },
    },
    {
      props: {type: 'navigationPill'},
      style: {
        ...typographyVariants?.body1,
        color: colors.supporting.white,
        backgroundColor: colors.primary.brand,
        borderRadius: 100,
        opacity: 1,
        padding: '8px 16px',
        minWidth: 'max-content',
        '&.Mui-disabled': {
          ...typographyVariants?.body1,
          color: colors.supporting.white,
          backgroundColor: colors.supporting.athensGrey,
        },
      }
    }
  ];
};
