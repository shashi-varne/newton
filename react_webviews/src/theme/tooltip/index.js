export const tooltipStyleOverRides = (colors) => {
  return {
    tooltip: {
      minWidth: "315px",
      maxWidth: "343px",
      padding: "8px",
      textAlign: "center",
      backgroundColor: colors.content.primary,
    },
    arrow: {
      color: colors.content.primary,
    },
  };
};
