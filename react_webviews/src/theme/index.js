import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides, tabsVariantsConfig, tabVariantsConfig } from './tabs';
import { radioButtonStyleOverRides } from './radioButton';
import { tooltipStyleOverRides } from './tooltip';
import { checkboxStyleOverRides } from './checkbox';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { dialogDefaultProps, dialogStylesOverride } from './dialog';
import { separatorStyleOverRides } from './separator';
import { badgeStyleOverRides } from './badge';
import { customShadows } from './shadows';
import {
  customVariantsFilledInput,
  customVariantsOutlinedInput,
  filledTextFieldStyleOverRides,
  helperTextStyleOverRides,
  inputAdornmentStyleOverRides,
  inputLabelStyleOverRides,
  outlinedTextFieldStyleOverRides,
} from './textfield';
const defaultTheme = createTheme();

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
      MuiTooltip: {
        styleOverrides: tooltipStyleOverRides(colors),
      },
      MuiDivider: {
        styleOverrides: separatorStyleOverRides(colors)
      },
      MuiRadio: {
        styleOverrides: radioButtonStyleOverRides(colors),
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
      MuiModal: {
        styleOverrides : {
          root:{
            [defaultTheme.breakpoints.up('sm')]: {
              left: '300px !important',
              right: 'unset !important',
              width: 'var(--desktop-width) !important',
              top: '60px !important'
            }
          }
        }
      },
      MuiBadge: {
        styleOverrides: badgeStyleOverRides(colors, partnerConfig),
      },
      MuiFormHelperText: {
        styleOverrides: helperTextStyleOverRides(colors, partnerConfig),
      },
    },
    shadows: customShadows()
  };
  return createTheme(theme);
};

export default getTheme;