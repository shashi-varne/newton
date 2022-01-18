import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides, tabsVariantsConfig, tabVariantsConfig } from './tabs';
import { checkboxStyleOverRides } from './checkbox';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { separatorStyleOverRides } from './separator';
import {
  customVariantsFilledInput,
  customVariantsOutlinedInput,
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
        variants: customVariantsFilledInput(colors),
        styleOverrides: filledTextFieldStyleOverRides(colors, partnerConfig),
      },
      MuiOutlinedInput: {
        variants: customVariantsOutlinedInput(colors),
        styleOverrides: outlinedTextFieldStyleOverRides(colors, partnerConfig),
      },
      MuiInputLabel: {
        styleOverrides: inputLabelStyleOverRides(colors, partnerConfig),
      },
      MuiInputAdornment: {
        styleOverrides: inputAdornmentStyleOverRides(colors)
      },
      MuiDivider: {
        styleOverrides: separatorStyleOverRides(colors)
      },
      MuiTabs: {
        variants:tabsVariantsConfig(),
        styleOverrides: tabsStyleOverRides()
      },
      MuiTab: {
        variants:tabVariantsConfig(colors, partnerConfig),
        styleOverrides: tabStyleOverRides(colors, partnerConfig)
      },
      MuiDialog: {
        defaultProps: dialogDefaultProps(),
        styleOverrides:dialogStylesOverride()
      },
      MuiFormHelperText: {
        styleOverrides: helperTextStyleOverRides(colors, partnerConfig),
      },
    },
  };
  return createTheme(theme);
};

export default getTheme;
