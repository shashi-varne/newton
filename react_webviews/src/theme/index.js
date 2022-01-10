import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tooltipStyleOverRides } from './tooltip';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { createTheme } from '@mui/material';
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
        styleOverrides: switchStyleOverRides(colors),
      },
      MuiDialog: {
        defaultProps: dialogDefaultProps(),
        styleOverrides:dialogStylesOverride()
      },
      MuiTooltip: {
        styleOverrides: tooltipStyleOverRides(colors),
      },
    },
  };
  return createTheme(theme);
};

export default getTheme;
