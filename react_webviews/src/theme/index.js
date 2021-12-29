import { buttonStyleOverRides, buttonVariantsConfig } from './button';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { createTheme } from '@mui/material';
import { filledTextFieldStyleOverRides, inputAdornmentStyleOverRides, inputLabelStyleOverRides } from './textfield';

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
      MuiFilledInput:{
        defaultProps: {
          disableUnderline: true
        },
        styleOverrides:filledTextFieldStyleOverRides(colors)
      },
      MuiInputLabel: {
        styleOverrides: inputLabelStyleOverRides(colors)
      },
      MuiInputAdornment: {
        styleOverrides: inputAdornmentStyleOverRides(colors)
      }
    },
  };
  return createTheme(theme);
};

export default getTheme;
