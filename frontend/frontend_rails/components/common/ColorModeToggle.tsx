import React from "react";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../../contexts/ColorModeContext";

const ColorModeToggle: React.FC = () => {
	const theme = useTheme();
	const colorMode = useColorMode(); // ColorModeContextからtoggleColorModeを取得

	return (
		<IconButton
			onClick={colorMode.toggleColorMode}
			color="inherit"
			aria-label="テーマ切り替え"
		>
			{theme.palette.mode === "dark" ? (
				<Brightness7Icon />
			) : (
				<Brightness4Icon />
			)}
		</IconButton>
	);
};

export default ColorModeToggle;
