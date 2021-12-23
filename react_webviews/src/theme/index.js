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
    MuiRadio: {
      styleOverrides: {
        root: {
          color: color.primary.brand,
          padding: 4,
          '&.Mui-disabled': {
            color: color.supporting.athensGrey,
          },
          '& .MuiSvgIcon-root': { fontSize: 16 },
        }
      }
    }
  },
});

export default theme;
