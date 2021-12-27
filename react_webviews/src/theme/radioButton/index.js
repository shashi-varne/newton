import colors from "../colors";

export const radioButtonStyleOverRides = () => {
  return {
    root: {
      color: colors.primary.brand,
      padding: 4,
      "&.Mui-disabled": {
        color: colors.supporting.athensGrey,
      },
      "& .MuiSvgIcon-root": { fontSize: 16 },
    },
  };
};
