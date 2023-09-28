// theme.ts
// default theme values https://mantine.dev/theming/default-theme/

import { createTheme, mergeMantineTheme, DEFAULT_THEME } from '@mantine/core';

const themeOverride = createTheme({
  colors: {
    "dark": [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#2C2E33",
      "#25262b",
      "#18181b", // "#1A1B1E",
      "#141517",
      "#101113"
    ],
  }
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
