import { getConfig } from 'utils/functions';

const config = getConfig();
export const themeConfig = {
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: config.styles.primaryColor,
            // dark: will be calculated from palette.primary.main,
            contrastText: '#ffffff',
        },
        secondary: {
            // light: '#0066ff',
            main: config.styles.secondaryColor,
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffffff',
        },
        default: {
            // light: '#0066ff',
            main: config.styles.default,
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
                  color: config.styles.primaryColor,
                },
                "&$focused&$error": {
                    color: config.styles.primaryColor,
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
                color: config.styles.default
            },
            fullWidth: {
                // marginBottom: '12px'
            },
            focused: {
                borderColor: config.styles.inputFocusedColor || config.styles.primaryColor,
            },
            underline: {
                "&$error": {
                    color: config.styles.primaryColor,
                },
                '&:after': {
                    backgroundColor: config.styles.inputFocusedColor || config.styles.primaryColor
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
                color: config.uiElements.formLabel.color,
                fontWeight: 'normal'
            },
            shrink: {
                transform: 'translate(0, 1.5px) scale(0.85)'
            }
        },
        MuiButton: {
            raisedSecondary: {
                '&:hover': {
                    backgroundColor: config.uiElements.button.hoverBackgroundColor || config.styles.secondaryColor
                },
                backgroundColor: config.styles.secondaryColor,
                color: '#fff',
                borderRadius: config.uiElements.button.borderRadius,
                boxShadow: 'none'
            },
            disabled: {
                // opacity: 0.4,
                color: `${config.uiElements.button.disabledColor} !important`,
                backgroundColor: `${config.uiElements.button.disabledBackgroundColor} !important`,
                touchAction: 'none'
            },
            label: {
                textTransform: 'uppercase'
            },
            root: {
                borderRadius: config.uiElements.button.borderRadius,
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
                color: config.styles.primaryColor,
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

export const commonBackMapper = {
    '/withdraw/insta': '/withdraw',
    '/withdraw': '/',
    '/my-account': '/',
    '/withdraw/otp/success': '/',
    '/withdraw/otp/failed': '/withdraw',
    '/kyc/compliant-report-verified': '/',
    '/kyc/compliant-report-complete': '/',
    '/kyc/compliant-personal-details': '/kyc/journey',
    '/reports/redeemed-transaction': '/reports',
    '/reports/switched-transaction': '/reports',
    '/reports/sip/pause-request': '/reports/sip',
    '/reports/sip/details': '/reports/sip',
    '/reports/sip': '/reports',
}