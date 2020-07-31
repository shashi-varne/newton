import { getConfig } from 'utils/functions';

export const themeConfig = {
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: getConfig().primary,
            // dark: will be calculated from palette.primary.main,
            contrastText: '#ffffff',
        },
        secondary: {
            // light: '#0066ff',
            main: getConfig().secondary,
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffffff',
        },
        default: {
            // light: '#0066ff',
            main: getConfig().default,
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffffff',
        }
        // error: will us the default color
    },
    overrides: {
        MuiFormControl: {
            root: {
                width: '100%'
            }
        },
        MuiFormLabel: {
            root: {
                "&$focused": {
                  color: getConfig().primary,
                },
                "&$focused&$error": {
                    color: getConfig().primary,
                },
                "&$error": {
                    color: '#f44336',
                }
            }, 
        },
        MuiInput: {
            input: {
                padding: '11px 0 7px',
                fontSize: '14px',
                color: getConfig().default
            },
            fullWidth: {
                // marginBottom: '12px'
            },
            focused: {
                borderColor: getConfig().inputFocusedColor || getConfig().primary,
            },
            underline: {
                "&$error": {
                    color: getConfig().primary,
                },
                '&:after': {
                    backgroundColor: getConfig().inputFocusedColor || getConfig().primary
                },
                transform: 'inherit',
                transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
            },
            error: {
                '&:after': {
                    backgroundColor: 'green'
                }
            },
            root: {
            },
            disabled: {
                opacity: 0.4
            }
        },
        MuiInputLabel: {
            root: {
                fontSize: '0.9rem',
                color: getConfig().label,
                fontWeight: 'normal'
            },
            shrink: {
                transform: 'translate(0, 1.5px) scale(0.85)'
            }
        },
        MuiButton: {
            raisedSecondary: {
                '&:hover': {
                    backgroundColor: getConfig().secondary
                },
                backgroundColor: getConfig().secondary,
                color: '#fff',
                borderRadius: 4,
                boxShadow: 'none'
            },
            disabled: {
                // opacity: 0.4,
                color: '#fff !important',
                backgroundColor: '#b4ebc3 !important'
            },
            label: {
                textTransform: 'capitalize'
            }
        },
        MuiIconButton: {
            root: {
                height: '56px'
            }
        },
        MuiCheckbox: {
            root: {
                color: getConfig().primary,
                position: 'relative',
                left: '-15px'
            }
        }
    }
}

export function bankAccountTypeOptions(isNri) {
    var account_types = [];
    if (!isNri) {
      account_types = [
        {
          value: "CA",
          name: "Current Account"
        },
        {
          value: "CC",
          name: "Cash Credit"
        },
        {
          value: "SB",
          name: "Savings Account"
        }
      ];
    } else {
      account_types = [
        {
          value: "SB-NRE",
          name: "Non Resident External Account (NRE)"
        },
        {
          value: "SB-NRO",
          name: "Non Resident Ordinary Account (NRO)"
        }
      ];
    }
    return account_types;
  }

  export const bankAccountTypeMapper = {
      'CA': 'Current Account',
      'CC': 'Cash Credit',
      'SB': 'Savings Account',
      'SB-NRE': 'Non Resident External Account (NRE)',
      'SB-NRO': 'Non Resident Ordinary Account (NRO)'
  }