// src/components/DarkModeToggle.tsx
import React from "react";
import { IconButton, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useColorMode } from "../../contexts/ColorModeContext";

const DarkModeToggle: React.FC = () => {
	const theme = useTheme();
	const { toggleColorMode } = useColorMode();

	return (
		<IconButton onClick={toggleColorMode} color="inherit">
			{theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
		</IconButton>
	);
};

export default DarkModeToggle;
