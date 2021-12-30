export const tooltipStyleOverRides = (colors) => {
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
    arrow: {
      color: colors.content.primary,
    },
  };
};
