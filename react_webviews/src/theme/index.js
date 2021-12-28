import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides } from './tabs/index.js';
import colors from './colors';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.brand,
    },
    secondary: {
      main: colors.action.brand,
    },
    foundationColors: colors
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
    MuiTabs: {
      styleOverrides: tabsStyleOverRides()
    },
    MuiTab: {
      styleOverrides: tabStyleOverRides()
    },
  },
});

export default theme;
