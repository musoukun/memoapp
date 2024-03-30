// import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import { createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/pages/Home";
import Memo from "./components/pages/Memo";

function App() {
	const theme = createTheme({
		palette: {
			mode: "dark",
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<AuthLayout />}>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Route>
					<Route path="/" element={<AppLayout />}>
						<Route index element={<Home />} />
						<Route path="memo" element={<Home />} />
						<Route path="memo/:id" element={<Memo />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
