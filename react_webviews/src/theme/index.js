import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides } from './tabs/index.js';
import { checkboxStyleOverRides } from './checkbox';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { dialogDefaultProps, dialogStylesOverride } from './dialog';

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
        variants: buttonVariantsConfig(colors, partnerConfig),
        styleOverrides: buttonStyleOverRides(colors, partnerConfig),
      },
      MuiSwitch: {
        styleOverrides: switchStyleOverRides(colors)
      },
      MuiCheckbox: {
        styleOverrides: checkboxStyleOverRides(colors),
      },
      MuiTabs: {
        styleOverrides: tabsStyleOverRides()
      },
      MuiTab: {
        styleOverrides: tabStyleOverRides(colors, partnerConfig)
      },
      MuiDialog: {
        defaultProps: dialogDefaultProps(),
        styleOverrides:dialogStylesOverride()
      }
    },
  };
  return createTheme(theme);
};

export default getTheme;
