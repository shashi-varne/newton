import colors from "../colors";

export const tooltipStyleOverRides = () => {
  return {
    tooltip: {
      padding: 8,
      fontSize: 14,
      maxWidth: 350,
      fontWeight: 400,
      lineHeight: "22px",
      textAlign: "center",
      backgroundColor: colors.content.primary,
    },
  };
};
