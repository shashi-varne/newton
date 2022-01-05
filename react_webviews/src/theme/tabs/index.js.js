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
      textTransform: 'none',
      fontSize: 14,
      fontWeight: FONT_WEIGHT['Regular'],
      '&.Mui-disabled': {
        color: colorConfig.supporting.athensGrey,
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

export const tabVariantsConfig = () => {
  return [
    {
      props: { type: 'pills' },
      style: {
        zIndex: 2,
        color: colorConfig.primary.brand,
        fontSize: 14,
        fontWeight: FONT_WEIGHT['Regular'],
        minWidth: 76,
        padding: '8px 16px',
        '&.Mui-selected': {
          color: colorConfig.supporting.white,
          fontWeight: FONT_WEIGHT['Medium'],
        },
        '&.Mui-disabled': {
          color: colorConfig.supporting.white,
          backgroundColor: colorConfig.supporting.athensGrey,
          borderRadius: 100,
        },
      },
    },
  ];
};
