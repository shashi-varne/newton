import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import { tabsStyleOverRides, tabStyleOverRides, tabsVariantsConfig, tabVariantsConfig } from './tabs';
import { radioButtonStyleOverRides } from './radioButton';
import { checkboxStyleOverRides } from './checkbox';
import { tooltipStyleOverRides } from './tooltip';
import { switchStyleOverRides } from './switch';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
import getPartnerThemeData from './utils';
import { dialogDefaultProps, dialogStylesOverride } from './dialog';
import { separatorStyleOverRides } from './separator';
import { badgeStyleOverRides } from './badge';
import { customShadows } from './shadows';

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
        styleOverrides:dialogStylesOverride(),
      },
      MuiBadge: {
        styleOverrides: badgeStyleOverRides(colors, partnerConfig),
      }
    },
    shadows: customShadows()
  };
  return createTheme(theme);
};

export default getTheme;
