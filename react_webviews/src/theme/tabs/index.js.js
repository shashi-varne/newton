import { FONT_WEIGHT } from '../typography';

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
      color: colors?.content?.primary,
      fontSize: 14,
      textTransform: 'none',
      '&.Mui-disabled': {
        fontWeight: FONT_WEIGHT['Regular'],
        color: colors?.supporting?.athensGrey,
      },
      minHeight: 36,
    },
  };
};
