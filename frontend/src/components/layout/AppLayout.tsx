import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authUtils from "../../utils/authUtil";
import SideBar from "../common/Sidebar";
import { userStateAtom } from "../../atoms/userAtoms";
import { useSetRecoilState } from "recoil";
import "../../App.css";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const setUser = useSetRecoilState(userStateAtom);

	useEffect(() => {
		const checkAuth = async () => {
			const isUser = await authUtils.isAuthenticated();
			if (!isUser) {
				navigate("/login");
			} else {
				setUser(isUser);
				setLoading(false);
			}
		};
		checkAuth();
	}, [navigate]);

	return loading ? (
		<div className="flex items-center justify-center h-full">
			<div className="font-roboto text-[20px]">Loading...</div>
		</div>
	) : (
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
