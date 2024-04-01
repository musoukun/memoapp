// import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import { CssBaseline } from "@mui/material";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/pages/Home";
import Memo from "./components/pages/Memo";
import { ColorModeProvider } from "./contexts/ColorModeContext";

function App() {
	return (
		<ColorModeProvider>
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
		</ColorModeProvider>
	);
}

export default App;
