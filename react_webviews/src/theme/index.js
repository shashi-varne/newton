import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides, tabsVariantsConfig, tabVariantsConfig } from './tabs/index.js';
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
      MuiTabs: {
        variants:tabsVariantsConfig(),
        styleOverrides: tabsStyleOverRides()
      },
      MuiTab: {
        variants:tabVariantsConfig(),
        styleOverrides: tabStyleOverRides()
      },
    },
  };
  return createTheme(theme);
};

export default getTheme;
