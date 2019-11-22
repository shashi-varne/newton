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
        MuiInput: {
            input: {
                padding: '11px 0 7px',
                fontSize: '14px',
            },
            focused: {
                borderColor: getConfig().inputFocusedColor || getConfig().primary,
            },
            underline: {
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
                color: '#fff'
            },
            disabled: {
                opacity: 0.4,
                color: '#fff !important'
            }
        },
        MuiIconButton: {
            root: {
                height: '56px'
            }
        },
        MuiCheckbox: {
            root: {
                color: getConfig().primary
            }
        }
    }
}