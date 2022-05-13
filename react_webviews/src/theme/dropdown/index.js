import baseTypographyConfig from "../typography";

export const dropdownStyleOverRides = (colors, partnerConfig) => {
  const typographyConfig = baseTypographyConfig(colors, partnerConfig);
  return {
    select: {
      ...typographyConfig["body5"],
      padding: "25px 16px 8px 12px",
      borderBottomRightRadius: "0px",
      borderBottomLeftRadius: "0px",
      borderTopRightRadius: "8px",
      borderTopLeftRadius: "8px",
      "&:focus": {
        backgroundColor: colors.supporting.white,
        borderBottomRightRadius: "8px",
        borderBottomLeftRadius: "8px",
      },
    },
  };
};
