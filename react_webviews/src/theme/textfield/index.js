import baseTypographyConfig from '../typography';

export const filledTextFieldStyleOverRides = (colors = {}, partnerConfig = {}) => {
  return {
    ...textFieldCommonStyle(colors, partnerConfig),
  };
};

export const outlinedTextFieldStyleOverRides = (colors = {}, partnerConfig = {}) => {
  return {
    ...textFieldCommonStyle(colors, partnerConfig),
    notchedOutline: {
      border: `1px solid ${colors?.supporting?.athensGrey} !important`,
    },
  };
};

export const inputLabelStyleOverRides = (colors = {}, partnerConfig = {}) => {
  const typographyVariants = baseTypographyConfig(colors, partnerConfig);
  return {
    root: {
      ...typographyVariants.body2,
      color: colors?.content?.secondary,
      fontSize: '14px !important',
      '&.Mui-focused, &.Mui-error': {
        color: colors?.content?.secondary,
      },
      '&.Mui-disabled': {
        color: colors?.supporting?.athensGrey,
      },
    },
    shrink: {
      ...typographyVariants.body5,
      fontSize: '12px !important',
      color: colors.content.secondary,
    },
  };
};

export const helperTextStyleOverRides = (colors = {}, partnerConfig = {}) => {
  const typographyVariants = baseTypographyConfig(colors, partnerConfig);
  return {
    root: {
      ...typographyVariants.body5,
      color: 'foundationColors.content.secondary',
      '&.Mui-error': {
        color: colors?.secondary?.lossRed['400'],
      },
    },
  };
};

export const inputAdornmentStyleOverRides = (colors) => {
  return {
    root: {
      marginRight: 1,
    },
    disablePointerEvents: {
      color: colors?.supporting?.athensGrey,
    },
  };
};

const textFieldCommonStyle = (colors = {}, partnerConfig = {}) => {
  const typographyVariants = baseTypographyConfig(colors, partnerConfig);
  return {
    root: {
      ...typographyVariants.body2,
      backgroundColor: 'transparent !important',
      border: `1px solid ${colors?.supporting?.athensGrey}`,
      borderRadius: 8,
      '&.Mui-disabled': {
        '> .MuiInputAdornment-root': {
          opacity: '0.5'
        }
      },
    },
    input: {
      sizeSmall: {
        padding: '8px',
      },
      '&.Mui-disabled': {
        color: colors?.supporting?.athensGrey,
        cursor: 'default',
        WebkitTextFillColor: colors?.supporting?.athensGrey,
      },
    },
  };
};

export const customVariantsFilledInput = (colors = {}) => {
  return customCommonVariants(colors);
};

export const customVariantsOutlinedInput = (colors = {}) => {
  return customCommonVariants(colors);
};

const customCommonVariants = (colors={}) => {
  return [
    {
      props: { size: 'small' },
      style: {
        color: colors?.content?.primary,
      },
    },
    {
      props: {customvariant: 'searchBar'},
      style: {
        borderRadius: '24px',
        backgroundColor: `${colors?.supporting?.grey} !important`,
        border: 'none',
        '& .MuiOutlinedInput-input': {
          padding: '0px 8px',
          borderRadius: '24px',
          height: '40px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none !important',
        }
      }
    }
  ];
};
