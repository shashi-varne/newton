import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides, tabsVariantsConfig, tabVariantsConfig } from './tabs';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';

const getTheme = () => {
  const {colors, partnerConfig} = getPartnerThemeData();
  
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
    typography: baseTypographyConfig(colors, partnerConfig),
    components: {
      MuiTypography: {
        variants: customTypographyVariantProps(),
      },
      MuiButton: {
        variants: buttonVariantsConfig(colors),
        styleOverrides: buttonStyleOverRides(colors, partnerConfig),
      },
      MuiSwitch: {
        styleOverrides: switchStyleOverRides(colors),
      },
      MuiTabs: {
        variants:tabsVariantsConfig(),
        styleOverrides: tabsStyleOverRides(colors)
      },
      MuiTab: {
        variants:tabVariantsConfig(colors, partnerConfig),
        styleOverrides: tabStyleOverRides(colors, partnerConfig)
      },
    },
  };
  return createTheme(theme);
};

export default getTheme;
