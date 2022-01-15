import { buttonStyleOverRides, buttonVariantsConfig } from './button';
import { checkboxStyleOverRides } from './checkbox';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { createTheme } from '@mui/material';
import {
  filledTextFieldStyleOverRides,
  helperTextStyleOverRides,
  inputAdornmentStyleOverRides,
  inputLabelStyleOverRides,
  outlinedTextFieldStyleOverRides,
} from './textfield';
import { dialogDefaultProps, dialogStylesOverride } from './dialog';

const getTheme = () => {
  const { colors, partnerConfig } = getPartnerThemeData();

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
      MuiFilledInput: {
        defaultProps: {
          disableUnderline: true,
        },
        styleOverrides: filledTextFieldStyleOverRides(colors, partnerConfig),
      },
      MuiOutlinedInput: {
        styleOverrides: outlinedTextFieldStyleOverRides(colors, partnerConfig),
      },
      MuiInputLabel: {
        styleOverrides: inputLabelStyleOverRides(colors, partnerConfig),
      },
      MuiInputAdornment: {
        styleOverrides: inputAdornmentStyleOverRides(colors),
      },
      MuiDialog: {
        defaultProps: dialogDefaultProps(),
        styleOverrides: dialogStylesOverride(),
      },
      MuiFormHelperText: {
        styleOverrides: helperTextStyleOverRides(colors, partnerConfig),
      },
    },
  };
  return createTheme(theme);
};

export default getTheme;
