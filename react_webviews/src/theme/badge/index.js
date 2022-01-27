import baseTypographyConfig from "../typography";

export const badgeStyleOverRides = (colors, partnerConfig) => {
  const typographyConfig = baseTypographyConfig(colors, partnerConfig);
  return {
    badge: {
      ...typographyConfig["body6"],
      padding: "0px 5px",
      color: colors.supporting.white,
      backgroundColor: colors.secondary.lossRed[400],
      minWidth: "10px",
      minHeight: "10px",
    },
  };
};
