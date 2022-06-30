export const sliderStyleOverRides = (colors = {}) => {
  return {
    track: {
      backgroundColor: colors.action.brand,
    },
    thumb: {
      backgroundColor: colors.primary.brand,
      "&.Mui-disabled": {
        backgroundColor: colors.supporting.gainsboro,
      },
    },
    rail: {
      backgroundColor: colors.supporting.athensGrey,
    },
    root: {
      "&.Mui-disabled": {
        ".MuiSlider-track": {
          backgroundColor: colors.supporting.cadetBlue,
        },
      },
    },
  };
};
