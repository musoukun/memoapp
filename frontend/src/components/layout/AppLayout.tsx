import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import SideBar from "../common/Sidebar";

import "../../App.css";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
	const navigate = useNavigate();
	const user = localStorage.getItem("user");

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	return (
		<div id="mainRoot" className="flex h-screen">
			<div className="w-[320px] bg-gray-800 text-white relative z-1005">
				<SideBar />
			</div>
			<div className="flex-grow p-4 overflow-auto relative ">
				<Outlet />
			</div>
		</div>
	);
};

export default AppLayout;
