import colors from '../colors';

export const switchStyleOverRides = () => {
  return {
    switchBase: {
      color: colors.supporting.athensGrey,
      '&.Mui-disabled& + .MuiSwitch-track': {
        opacity: 1,
      },
    },
    thumb: {
      border: `2px solid ${colors.supporting.white}`,
      boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.16)',
    },
    track: {
      backgroundColor: colors.supporting.athensGrey,
      opacity: 1
    }
  };
};
