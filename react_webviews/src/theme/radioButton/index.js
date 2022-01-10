export const radioButtonStyleOverRides = (colors) => {
  return {
    root: {
      color: colors.primary.brand,
      padding: "4px",
      "&.Mui-disabled": {
        color: colors.supporting.athensGrey,
      },
      "&.Mui-checked": {
        "&.Mui-disabled": {
          color: colors.primary["200"],
        },
      },
      "& .MuiSvgIcon-root": { fontSize: "16px" },
    },
  };
};
