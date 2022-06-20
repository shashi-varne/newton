export const sliderStyleOverRides = (colors = {}) => {
  return {
    track: {
      backgroundColor: colors.action.brand,
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
