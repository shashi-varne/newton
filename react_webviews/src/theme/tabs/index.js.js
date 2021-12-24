import colorConfig from '../colors';
import { FONT_WEIGHT } from '../typography';

export const tabsStyleOverRides = () => {
  return {
    root: {
      backgroundColor: colorConfig.supporting.white,
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

export const tabStyleOverRides = () => {
  return {
    root: {
      color: colorConfig.content.primary,
      fontSize: 14,
      '&.Mui-disabled': {
        fontWeight: FONT_WEIGHT['Regular'],
        color: colorConfig.supporting.athensGrey,
      },
      minHeight: 36,
    },
  };
};
