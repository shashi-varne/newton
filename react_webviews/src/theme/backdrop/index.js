export const backDropStylesOverride = (theme) => {
    return {
        root: {
          [theme.breakpoints.up('sm')]: {
            top: '60px',
            marginLeft: '300px',
            maxWidth: 'var(--desktop-width)'
          }
        }
      }
}