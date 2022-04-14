// import Stick_No_Bills from "./assets/Fonts/StickNoBills-Regular.ttf";
import { createTheme } from '@material-ui/core';

const theme = createTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#795548',
            dark: "#4b2c20",
            light: "#a98274",
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#cfcfcf',
            main: '#9e9e9e',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#000000',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
    typography: {
        fontFamily: 'Titillium Web,Arial',
        button: {
            // fontStyle: 'bold',
            // fontFamily: 'Stick No Bills'
        },

    },
    components: {
        // 'https://fonts.googleapis.com/css2?family=Stick+No+Bills&display=swap'
        // 'https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap'
        //     MuiCssBaseline: {
        //         styleOverrides: `
        //     @font-face {
        //       font-family: 'Stick No Bills';
        //       font-style: normal;
        //       font-display: swap;
        //       font-weight: 400;
        //       src:url('https://fonts.gstatic.com/s/sticknobills/v1/bWts7ffXZwHuAa9Uld-oEK4QKlxj9f9t_7uEmjcVv8QLMLKxGhc.woff2') format('ttf') ;
        //       unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        //     }
        //   `,

        //     },
    }
});
export default theme;