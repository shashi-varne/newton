import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { checkboxStyleOverRides } from './checkbox';
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
    typography: baseTypographyConfig,
    components: {
      MuiTypography: {
        variants: customTypographyVariantProps(),
      },
      MuiButton: {
        variants: buttonVariantsConfig(),
        styleOverrides: buttonStyleOverRides(),
      },
      MuiSwitch: {
        styleOverrides: switchStyleOverRides()
      },
      MuiCheckbox: {
        styleOverrides: checkboxStyleOverRides(),
      },
    },
  }
  return createTheme(theme);
};

export default getTheme;
