import { getConfig } from 'utils/functions';

export const themeConfig = {
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: getConfig().styles.primaryColor,
            // dark: will be calculated from palette.primary.main,
            contrastText: '#ffffff',
        },
        secondary: {
            // light: '#0066ff',
            main: getConfig().styles.secondaryColor,
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffffff',
        },
        default: {
            // light: '#0066ff',
            main: getConfig().styles.default,
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
                  color: getConfig().styles.primaryColor,
                },
                "&$focused&$error": {
                    color: getConfig().styles.primaryColor,
                },
                "&$error": {
                    color: '#f44336',
                }
            }, 
        },
        MuiFormHelperText: {
            root: {
                marginBottom: 10
            }
        },
        MuiInput: {
            input: {
                padding: '11px 0 7px',
                fontSize: '14px',
                color: getConfig().styles.default
            },
            fullWidth: {
                // marginBottom: '12px'
            },
            focused: {
                borderColor: getConfig().styles.inputFocusedColor || getConfig().styles.primaryColor,
            },
            underline: {
                "&$error": {
                    color: getConfig().styles.primaryColor,
                },
                '&:after': {
                    backgroundColor: getConfig().styles.inputFocusedColor || getConfig().styles.primaryColor
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
                color: getConfig().styles.label,
                fontWeight: 'normal'
            },
            shrink: {
                transform: 'translate(0, 1.5px) scale(0.85)'
            }
        },
        MuiButton: {
            raisedSecondary: {
                '&:hover': {
                    backgroundColor: getConfig().styles.secondaryColor
                },
                backgroundColor: getConfig().styles.secondaryColor,
                color: '#fff',
                borderRadius: 4,
                boxShadow: 'none'
            },
            disabled: {
                // opacity: 0.4,
                color: '#fff !important',
                backgroundColor: 'var(--color-action-disable) !important',
                touchAction: 'none'
            },
            label: {
                textTransform: 'capitalize'
            },
            root: {
                boxShadow: 'none !important'
            }
        },
        MuiIconButton: {
            root: {
                height: '56px'
            }
        },
        MuiCheckbox: {
            root: {
                color: getConfig().styles.primaryColor,
                position: 'relative',
                left: '-15px'
            }
        },
        MuiDialogActions: {
            root: {
                display: 'block'
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