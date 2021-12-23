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
        },
        thumb: {
          border: `2px solid ${color.supporting.white}`,
          boxShadow: 'none',
        },
        track: {
          backgroundColor: color.supporting.athensGrey,
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: 8,
          fontSize: 14,
          maxWidth: 350,
          fontWeight: 400,
          lineHeight: "22px",
          textAlign: "center",
          backgroundColor: color.content.primary,
        }
      }
    }
  },
});

export default theme;
