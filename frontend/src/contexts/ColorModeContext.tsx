// src/contexts/ColorModeContext.tsx
import React, {
	createContext,
	useContext,
	ReactNode,
	useMemo,
	useState,
} from "react";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";

interface ColorModeContextType {
	toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
	toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

interface ColorModeProviderProps {
	children: ReactNode;
}

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({
	children,
}) => {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const [mode, setMode] = useState<"light" | "dark">(
		prefersDarkMode ? "dark" : "light"
	);

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

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ColorModeContext.Provider>
	);
};
