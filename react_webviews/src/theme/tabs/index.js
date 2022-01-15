import baseTypographyConfig, { FONT_WEIGHT } from '../typography';

export const tabsStyleOverRides = () => {
  return {
    root: {
      backgroundColor: 'transparent',
      height: 36,
      minHeight: 36,
    },
    flexContainer: {
      flex: 1,
      justifyContent: 'space-between !important'
    },
    scroller: {
      display: 'flex'
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
      height: 36,
      padding: '0px 0px 12px 0px',
      minWidth: 'fit-content',
      marginRight: '24px',
      ':last-child': {
        marginRight: '0px'
      }
    },
  };
};
