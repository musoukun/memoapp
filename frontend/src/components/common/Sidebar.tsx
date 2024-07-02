import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Memo } from "../../types/api";

const Sidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const user = useRecoilValue(userStateAtom);
	const [memos, setMemos] = useRecoilState(memosStateAtom);
	const sortedMemos = useRecoilValue(sortedMemosSelector);
	const favoriteMemos = useRecoilValue(favoriteMemosSelector);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const resetMemos = useResetRecoilState(memosStateAtom);
	const resetMemo = useResetRecoilState(memoStateAtom);
	const resetUser = useResetRecoilState(userStateAtom);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
	const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
	const menuRef = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		const currentMemoId = location.pathname.split("/").pop();
		setActiveId(currentMemoId || null);
	}, [location]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setMenuOpenId(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

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

	const addMemo = async () => {
		try {
			const newMemo: Memo = {
				id: Date.now().toString(),
				title: "",
				description: "",
				favorite: false,
				icon: "📄",
				position: 0,
				favoritePosition: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			navigate(`/memo/${newMemo.id}`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	const deleteMemo = async (id: string) => {
		try {
			await memoApi.delete(id);
			setMemos(memos.filter((memo) => memo.id !== id));
			if (activeId === id) {
				// 削除した前後のメモどちらかがあれば遷移
				const index = memos.findIndex((memo) => memo.id === id);
				const nextMemo = memos[index + 1];
				const prevMemo = memos[index - 1];

				if (nextMemo) {
					navigate(`/memo/${nextMemo.id}`);
				} else if (prevMemo) {
					navigate(`/memo/${prevMemo.id}`);
				} else {
					navigate("/memo");
				}
				// ↑三項演算子を使うと以下のようになる
				// navigate(`/memo/${nextMemo ? nextMemo.id : prevMemo ? prevMemo.id : ""}`);

				// メモが1つだけの場合はトップページに遷移
				if (memos.length === 1) {
					navigate("/");
				}
			}
		} catch (error) {
			console.error("Failed to delete memo:", error);
		} finally {
			setMenuOpenId(null);
		}
	};

	const renderMemoItem = (item: Memo) => {
		const isActive = activeId === item.id;
		const itemClasses = `flex items-center justify-between p-4 text-black dark:text-white ${
			isActive ? "bg-gray-200 dark:bg-gray-700" : ""
		}`;

		return (
			<li key={item.id} className="pl-8 relative">
				<Link to={`/memo/${item.id}`} className={itemClasses}>
					<span>
						{item.icon} {item.title}
					</span>
					<FontAwesomeIcon
						icon={faEllipsisH}
						className="cursor-pointer"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							const rect =
								e.currentTarget.getBoundingClientRect();
							setMenuPosition({
								top: rect.bottom,
								left: rect.right + 5, // 5px right offset
							});
							setMenuOpenId(
								menuOpenId === item.id
									? null
									: (item.id as string)
							);
						}}
					/>
				</Link>
				{menuOpenId === item.id && (
					<div
						ref={menuRef}
						className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 z-[10000]"
						style={{
							top: `${menuPosition.top}px`,
							left: `${menuPosition.left}px`,
						}}
					>
						<button
							onClick={() => deleteMemo(item.id as string)}
							className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full"
						>
							<FontAwesomeIcon icon={faTrash} className="mr-2" />
							Delete
						</button>
					</div>
				)}
			</li>
		);
	};

	return (
		<div className="w-[250px] h-screen bg-white dark:bg-gray-800 flex flex-col overflow-hidden  z-[9999]">
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
							<span className="text-sm font-bold text-black dark:text-white">
								お気に入り
							</span>
						</div>
					</li>
					{favoriteMemos
						.filter((item) => item.favorite)
						.map(renderMemoItem)}
					<li className="mt-2">
						<div className="flex items-center justify-between w-full p-4">
							<span className="text-sm font-bold text-black dark:text-white">
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
					{sortedMemos.map(renderMemoItem)}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
