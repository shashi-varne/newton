import { buttonStyleOverRides, buttonVariantsConfig } from './button';
import { radioButtonStyleOverRides } from './radioButton';
import { checkboxStyleOverRides } from './checkbox';
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
        styleOverrides: switchStyleOverRides(colors)
      },
      MuiRadio: {
        styleOverrides: radioButtonStyleOverRides(colors),
      },
      MuiCheckbox: {
        styleOverrides: checkboxStyleOverRides(colors),
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
