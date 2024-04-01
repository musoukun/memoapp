/* eslint-disable @typescript-eslint/no-unused-vars */
// src/theme/index.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const lightTheme = createTheme({
	palette: {
		mode: "light",
		// ライトモードのカラーパレットをカスタマイズ
		// primary: { main: '#your-color' },
		// secondary: { main: '#your-color' },
		// ...
	},
	// その他のテーマ設定
});

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		// ダークモードのカラーパレットをカスタマイズ
		// primary: { main: '#your-color' },
		// secondary: { main: '#your-color' },
		// ...
	},
	// その他のテーマ設定
});

const defaultTheme = createTheme({
	components: {
		// Global styles
		MuiCssBaseline: {
			styleOverrides: `
        .defaultRoot {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
        }
        .mainRoot {
          max-width: 1280px;
          padding: 2rem;
        }
      `,
		},
	},
});

// レスポンシブなフォントサイズを設定
const responsiveLightTheme = responsiveFontSizes(lightTheme);
const responsiveDarkTheme = responsiveFontSizes(darkTheme);

export { responsiveLightTheme, responsiveDarkTheme, defaultTheme };
