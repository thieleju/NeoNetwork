// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const light_theme = {
  dark: false,
  colors: {
    primary: "#4CAF50",
    background: "#F5F5F5",
    secondary: "#424242",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
  },
};

const dark_theme = {
  dark: true,
  colors: {
    primary: "#4CAF50",
    primary_dark: "#388E3C",
    background: "#F5F5F5",
    secondary: "#424242",
    secondary_dark: "#303030",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "dark_theme",
    themes: {
      dark_theme,
      light_theme,
    },
  },
});
