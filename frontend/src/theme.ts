import { createTheme } from '@mui/material/styles';

const palette = {
  medBlue: "#215889",
  medDarkCyan: "#174772"
}

const theme = createTheme({
  palette: {
    primary: {
      main: palette.medDarkCyan,
    },
    secondary: {
      main: palette.medBlue,
    },
    background: {
      default: '#fff',
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
  },
});

export default theme;
export { palette };