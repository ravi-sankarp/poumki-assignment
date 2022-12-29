import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#191b13'
    },
    secondary: {
      main: '#ffffff'
    }
  },
  typography: {
    allVariants: {
      fontFamily: ['Josefin Sans', 'sans-serif'].join(',')
    }
  }
});
export default theme;
