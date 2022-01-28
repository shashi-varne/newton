import baseTypographyConfig, { FONT_WEIGHT } from '../typography';

export const tabsStyleOverRides = () => {
  return {
    root: {
      backgroundColor: 'transparent',
      height: 36,
      minHeight: 36,
      '& .MuiTabScrollButton-root': {
        ':first-of-type': {
          display: 'none',
        },
        '&.Mui-disabled': {
          opacity: '0.4',
        },
      },
    },
    flexContainer: {
      flex: 1,
      justifyContent: 'space-between !important',
    },
    scroller: {
      display: 'flex',
    },
  };
};

export const tabStyleOverRides = (colors = {}, partnerConfig = {}) => {
  const typographyVariants = baseTypographyConfig(colors, partnerConfig);
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
      height: 36,
      padding: '0px 0px 12px 0px',
      minWidth: 'fit-content',
      maxWidth: 'fit-content',
      marginRight: '24px',
      ':last-child': {
        marginRight: '0px',
      },
    },
  };
};

export const tabsVariantsConfig = () => {
  return [
    {
      props: { type: 'pill' },
      style: {
        minHeight: 38,
        height: 38,
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
        minHeight: 38,
        height: 38,
        marginRight: '0px',
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
