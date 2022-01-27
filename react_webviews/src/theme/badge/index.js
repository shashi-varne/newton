import baseTypographyConfig from "../typography";

export const badgeStyleOverRides = (colors, partnerConfig) => {
  const typographyConfig = baseTypographyConfig(colors, partnerConfig);
  return {
    standard: {
      ...typographyConfig["body6"],
      padding: "0px 4px",
      color: colors.supporting.white,
      backgroundColor: colors.secondary.lossRed[400],
      minWidth: "14px",
      height: "14px",
    },
    dot: {
      minWidth: "10px",
      minHeight: "10px",
      borderRadius: "50%",
      backgroundColor: colors.secondary.lossRed[400],
    },
  };
};
