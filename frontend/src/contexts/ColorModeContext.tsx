import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { responsiveLightTheme, responsiveDarkTheme } from "../theme";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [mode, setMode] = useState<"light" | "dark">("light");

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) =>
					prevMode === "light" ? "dark" : "light"
				);
			},
		}),
		[]
	);

	const theme = useMemo(() => {
		return mode === "light" ? responsiveLightTheme : responsiveDarkTheme;
	}, [mode]);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
		</ColorModeContext.Provider>
	);
};

export const useColorMode = () => useContext(ColorModeContext);
