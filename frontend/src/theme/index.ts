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

		// secondary: { main: '#your-color' },
		// ...
	},
	// その他のテーマ設定
});

// // レスポンシブなフォントサイズを設定
const responsiveLightTheme = responsiveFontSizes(lightTheme);
const responsiveDarkTheme = responsiveFontSizes(darkTheme);

export { responsiveLightTheme, responsiveDarkTheme };
