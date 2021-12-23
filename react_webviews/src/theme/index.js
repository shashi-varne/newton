import { createTheme } from '@mui/material';
import { buttonStyleOverRides, buttonVariantsConfig, } from './button';
import color from './colors';
import baseTypographyConfig, { customTypographyVariantProps, FONT_WEIGHT } from './typography';
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
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: color.supporting.white,
          minHeight: 38
        },
        flexContainer: {
          display: 'block !important'
        },
        scrollButtons: {
          '&.Mui-disabled': {
            display: 'none'
          },
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: color.content.primary,
          fontSize: 14,
          '&.Mui-disabled': {
            fontWeight: FONT_WEIGHT['Regular'],
            color: color.supporting.athensGrey,
          },
          minHeight:36,
        },
      }
    },
    
  },
});

export default theme;
