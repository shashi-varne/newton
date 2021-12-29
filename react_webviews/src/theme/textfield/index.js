import baseTypographyConfig from '../typography';

export const filledTextFieldStyleOverRides = (colors) => {
  return {
    root: {
      ...baseTypographyConfig.body2,
      color: colors.content.primary,
      backgroundColor: `${colors.supporting.white} !important`,
      ':hover': {
        backgroundColor: colors.supporting.white,
      },
      border: `1px solid ${colors.supporting.athensGrey}`,
      borderRadius: 8,
      '&.Mui-disabled': {
        color: colors.supporting.athensGrey,
        cursor: 'default',
      },
    },
    input: {
      '&.Mui-disabled': {
        color: colors.supporting.athensGrey,
        cursor: 'default',
      },
    },
  };
};

export const inputLabelStyleOverRides = (colors) => {
  return {
    root: {
      ...baseTypographyConfig.body2,
      color: colors.content.secondary,
      fontSize: '14px !important',
      '&.Mui-focused, &.Mui-error': {
        ...baseTypographyConfig.body5,
        color: colors.content.secondary,
      },
      '&.Mui-disabled': {
        color: colors.supporting.athensGrey,
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
      color: colors.supporting.athensGrey,
    },
  };
};
