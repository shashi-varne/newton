import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides } from './tabs/index.js';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';

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
        styleOverrides: switchStyleOverRides(),
      },
      MuiTabs: {
        styleOverrides: tabsStyleOverRides()
      },
      MuiTab: {
        styleOverrides: tabStyleOverRides()
      },
    },
  };
  return createTheme(theme);
};

export default getTheme;
