import getPartnerThemeData from "../utils";

export const checkboxStyleOverRides = () => {
  const { colors  } = getPartnerThemeData();
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
