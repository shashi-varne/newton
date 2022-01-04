import baseTypographyConfig from "../typography";

export const tooltipStyleOverRides = (colors, partnerConfig) => {
  return {
    tooltip: {
      ...baseTypographyConfig(colors, partnerConfig)["body2"],
      padding: 8,
      maxWidth: 350,
      textAlign: "center",
      color: colors.supporting.white,
      backgroundColor: colors.content.primary,
    },
    arrow: {
      color: colors.content.primary,
    },
  };
};
