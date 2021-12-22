import colors from '../colors';

export const switchStyleOverRides = () => {
  return {
    switchBase: {
      color: colors.supporting.athensGrey,
      '& + .MuiSwitch-track': {
        opacity: 1,
      },
    },
    thumb: {
      border: `2px solid ${colors.supporting.white}`,
      boxShadow: 'none',
    },
    track: {
      backgroundColor: colors.supporting.athensGrey,
    },
  };
};
