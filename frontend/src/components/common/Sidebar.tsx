import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { userStateAtom } from "../../atoms/userAtoms";
import memoApi from "../../api/memoApi";
import {
	favoriteMemosSelector,
	memoStateAtom,
	memosStateAtom,
	sortedMemosSelector,
} from "../../atoms/memoAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlusSquare,
	faSignOutAlt,
	faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import DropdownMenu from "./DropdownMenu";

const Sidebar = () => {
	// const [activeIndex] = useState(0);
	const navigate = useNavigate();
	const user = useRecoilValue(userStateAtom);
	const [memos, setMemos] = useRecoilState(memosStateAtom);
	const sortedMemos = useRecoilValue(sortedMemosSelector);
	const favoriteMemos = useRecoilValue(favoriteMemosSelector);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const resetMemos = useResetRecoilState(memosStateAtom);
	const resetMemo = useResetRecoilState(memoStateAtom);
	const resetUser = useResetRecoilState(userStateAtom);
	// const location = useLocation();

	const [hoveredMemo, setHoveredMemo] = useState<string | null>(null);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const fetchMemos = async () => {
			try {
				const response = await memoApi.getAll();
				setMemos(response.data);
			} catch (error) {
				console.error("Failed to fetch memos:", error);
			}
		};

		fetchMemos();
	}, [setMemos]);

	const logout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		try {
			localStorage.removeItem("token");
			resetMemos();
			resetMemo();
			resetUser();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const home = async () => {
		try {
			navigate(`/`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	const addMemo = async () => {
		try {
			const res = await memoApi.create();
			const newMemos = [...memos, res.data];
			setMemos(newMemos);
			navigate(`/memo/${res.data.id}/?new=true`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	const handleDeleteMemo = async (id: string) => {
		try {
			await memoApi.delete(id);
			const updatedMemos = memos.filter((memo) => memo.id !== id);
			setMemos(updatedMemos);
			setOpenDropdown(null);
			navigate("/memo");
		} catch (error) {
			console.error("Failed to delete memo:", error);
		}
	};

	const renderMemoItem = (item: any, isFavorite: boolean = false) => (
		<li key={item.id} className={isFavorite ? "pl-8" : "pl-8"}>
			<div
				className="flex items-center justify-between p-4 text-black dark:text-white relative"
				onMouseEnter={() => setHoveredMemo(item.id)}
				onMouseLeave={() => setHoveredMemo(null)}
			>
				<Link to={`/memo/${item.id}`} className="flex-grow">
					{item.icon} {item.title}
				</Link>
				{hoveredMemo === item.id && (
					<button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							const rect =
								e.currentTarget.getBoundingClientRect();
							setDropdownPosition({
								x: rect.right,
								y: rect.bottom,
							});
							setOpenDropdown(
								openDropdown === item.id ? null : item.id
							);
						}}
						className="text-gray-600 dark:text-gray-400 ml-2"
					>
						<FontAwesomeIcon icon={faEllipsisH} />
					</button>
				)}
			</div>
		</li>
	);

	return (
		<>
			<div className="w-[320px] h-screen bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
				<div className="flex-shrink-0">
					<div className="flex items-center justify-between p-4">
						<span className="text-sm font-bold text-black dark:text-white">
							{user.username}
						</span>
						<button
							className="text-gray-600 dark:text-gray-400"
							onClick={logout}
						>
							<FontAwesomeIcon icon={faSignOutAlt} />
						</button>
					</div>
				</div>
				<div className="flex-grow overflow-y-auto">
					<ul>
						<li className="mt-2">
							<div className="flex items-center justify-between w-full p-4">
								<button
									className="text-gray-600 dark:text-gray-400"
									onClick={home}
								>
									<span className="text-sm font-bold text-black dark:text-white ml-1">
										🏠ホーム
									</span>
								</button>
							</div>
						</li>
						<li className="mt-2">
							<div className="flex items-center justify-between w-full p-4">
								<span className="text-sm font-bold text-black dark:text-white ml-1">
									🌟お気に入り
								</span>
							</div>
						</li>
						{favoriteMemos
							.filter((item) => item.favorite)
							.map((item) => renderMemoItem(item, true))}
						<li className="mt-2">
							<div className="flex items-center justify-between w-full p-4">
								<span className="text-sm font-bold text-black dark:text-white ml-1">
									プライベート
								</span>
								<button
									className="text-gray-600 dark:text-gray-400"
									onClick={addMemo}
								>
									<FontAwesomeIcon icon={faPlusSquare} />
								</button>
							</div>
						</li>
						{sortedMemos.map((item) => renderMemoItem(item))}
					</ul>
				</div>
			</div>
			{openDropdown && (
				<DropdownMenu
					memoId={openDropdown}
					position={dropdownPosition}
					onClose={() => setOpenDropdown(null)}
					onDelete={handleDeleteMemo}
				/>
			)}
		</>
	);
};

export default Sidebar;
