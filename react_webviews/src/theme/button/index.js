import { FONT_WEIGHT } from '../typography';

export const buttonVariantsConfig = (colors={}) => [
  {
    props: { size: 'small' },
    style: {
      minWidth: 140,
      height: 40,
    },
  },
  {
    props: { size: 'large' },
    style: {
      width: '100%',
      minWidth: 343,
      height: 48,
    },
  },
  {
    props: { variant: 'link' },
    style: {
      height: 21,
      fontSize: 16,
      minWidth: 'max-content',
      width: 'max-content',
      color: colors?.action?.brand,
      fontWeight: FONT_WEIGHT['Regular'],
      '&:hover': {
        color: colors?.primary?.action,
        backgroundColor: 'transparent',
      },
    },
  },
  {
    props: { variant: 'text' },
    style: {
      height: 48,
      minWidth: 343,
      fontSize: 16,
      fontWeight: FONT_WEIGHT['Medium'],
      borderRadius: 10,
    },
  },
  {
    props: { variant: 'text', size: 'small' },
    style: {
      height: 40,
      minWidth: 140,
    },
  },
  {
    props: { isloading: true },
    style: {
      pointerEvents: 'none',
    },
  },
];

export const buttonStyleOverRides = (colors={}, partnerConfig={}) => {
  return {
    contained: {
      color: colors?.supporting?.white,
      fontSize: 16,
      fontWeight: FONT_WEIGHT['Medium'],
      borderRadius: partnerConfig?.button?.borderRadius || 10,
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
