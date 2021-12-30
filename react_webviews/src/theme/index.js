import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tooltipStyleOverRides } from './tooltip';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { createTheme } from '@mui/material';

const getTheme = () => {
  const partnerThemeData = getPartnerThemeData();
  const colors = partnerThemeData?.colors;
  
  const theme = {
    palette: {
      primary: {
        main: colors.primary.brand,
      },
      secondary: {
        main: colors.action.brand,
      },
      foundationColors: colors,
    },
    typography: baseTypographyConfig(colors,partnerThemeData),
    components: {
      MuiTypography: {
        variants: customTypographyVariantProps(),
      },
      MuiButton: {
        variants: buttonVariantsConfig(colors),
        styleOverrides: buttonStyleOverRides(colors,partnerThemeData),
      },
      MuiSwitch: {
        styleOverrides: switchStyleOverRides(colors),
      },
      MuiTooltip: {
        styleOverrides: tooltipStyleOverRides(colors),
      },
    },
  };
  return createTheme(theme);
};

export default getTheme;
