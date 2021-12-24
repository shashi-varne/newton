import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import color from './colors';
import baseTypographyConfig, { customTypographyVariantProps } from './typography';
const theme = createTheme({
  palette: {
    primary: {
      main: color.primary.brand,
    },
    secondary: {
      main: color.action.brand,
    },
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
      styleOverrides: {
        switchBase: {
          color: color.supporting.athensGrey,
          '& + .MuiSwitch-track': {
            opacity: 1,
          },
          '&.Mui-disabled& + .MuiSwitch-track': {
            opacity: 1,
          },
        },
        thumb: {
          border: `2px solid ${color.supporting.white}`,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.16)',
        },
        track: {
          backgroundColor: color.supporting.athensGrey,
        }
      }
    }
  },
});

export default theme;
