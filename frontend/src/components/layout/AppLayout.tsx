import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import SideBar from "../common/Sidebar";

import "../../App.css";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
	const navigate = useNavigate();
	const user = localStorage.getItem("user");
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleSidebarToggle = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	return (
		<div id="mainRoot" className="flex h-screen">
			<div
				className={`bg-gray-800 text-white relative z-1005 transition-all duration-300 ${
					isSidebarCollapsed ? "w-6" : "w-[320px]"
				}`}
			>
				<SideBar onToggle={handleSidebarToggle} />
			</div>
			<div
				className={`flex-grow p-4 overflow-auto relative transition-all duration-300 ${
					isSidebarCollapsed ? "ml-0" : ""
				}`}
			>
				<Outlet />
			</div>
		</div>
	);
};

export default AppLayout;
