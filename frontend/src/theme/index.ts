/* eslint-disable @typescript-eslint/no-unused-vars */
// src/theme/index.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = createTheme({
	components: {
		// TextFieldに対するグローバルスタイル
		MuiTextField: {
			styleOverrides: {
				root: {
					// TextFieldの共通スタイル
					width: "100%",
					".MuiInputBase-input": {
						border: "none",
						padding: "8px 0",
						margin: 0,
						// テーマのカラーモードに基づく条件式を追加
						backgroundColor: (theme: {
							palette: { mode: string; grey: any[] };
						}) =>
							theme.palette.mode === "dark"
								? theme.palette.grey[900]
								: theme.palette.grey[100],
						color: (theme: { palette: { mode: string } }) =>
							theme.palette.mode === "dark" ? "white" : "black",
						"&:focus": {
							outline: "none",
						},
					},
				},
			},
		},
	},
});

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
