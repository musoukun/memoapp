import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { userStateAtom } from "../../atoms/userAtoms";
import noteApi from "../../api/noteApi";
import {
	favoriteNotesSelector,
	noteStateAtom,
	notesStateAtom,
	sortedNotesSelector,
} from "../../atoms/noteAtoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlusSquare,
	faSignOutAlt,
	faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import DropdownMenu from "./DropdownMenu";
import kanbanApi from "../../api/kanbanApi";
import { Kanban } from "../../types/kanban";
import { AxiosResponse } from "axios";

const Sidebar = () => {
	// const [activeIndex] = useState(0);
	const navigate = useNavigate();
	const user = useRecoilValue(userStateAtom);
	// ノートの状態を取得
	const [notes, setNotes] = useRecoilState(notesStateAtom);
	const sortedNotes = useRecoilValue(sortedNotesSelector);
	const favoriteNotes = useRecoilValue(favoriteNotesSelector);

	// ログイン、ログアウトの状態を管理
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const resetNotes = useResetRecoilState(notesStateAtom);
	const resetNote = useResetRecoilState(noteStateAtom);
	const resetUser = useResetRecoilState(userStateAtom);
	// const location = useLocation();

	const [hoveredNote, setHoveredNote] = useState<string | null>(null);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

	const [kanbans, setKanbans] = useState<Kanban[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const notesResponse = await noteApi.getAll();
				setNotes(notesResponse.data);

				const kanbansResponse: AxiosResponse<Kanban[]> =
					await kanbanApi.getUserKanbans();
				setKanbans(kanbansResponse.data);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [setNotes, setKanbans]);

	const logout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		try {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			resetNotes();
			resetNote();
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

	const addNote = async () => {
		try {
			const res = await noteApi.create();
			const newNotes = [...notes, res.data];
			setNotes(newNotes);
			navigate(`/note/${res.data.id}/?new=true`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	const handleDeleteNote = async (id: string) => {
		try {
			await noteApi.delete(id);
			const updatedNotes = notes.filter((note) => note.id !== id);
			setNotes(updatedNotes);
			setOpenDropdown(null);
			navigate("/note");
		} catch (error) {
			console.error("Failed to delete note:", error);
		}
	};

	const renderNoteItem = (item: any, isFavorite: boolean = false) => (
		<li key={item.id} className={isFavorite ? "pl-8" : "pl-8"}>
			<div
				className="flex items-center justify-between my-2 text-black dark:text-white relative"
				onMouseEnter={() => setHoveredNote(item.id)}
				onMouseLeave={() => setHoveredNote(null)}
			>
				<Link to={`/note/${item.id}`} className="flex-grow">
					{item.icon} {item.title}
				</Link>
				{hoveredNote === item.id && (
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

	const addKanban = async () => {
		try {
			const res: AxiosResponse<Kanban> = await kanbanApi.create({
				title: "New Kanban",
				main: false,
			});
			setKanbans([...kanbans, res.data]);
			navigate(`/kanban/${res.data.id}`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	const kanban = async () => {
		try {
			navigate(`/kanban`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

	const renderKanbanItem = (item: Kanban) => (
		<li key={item.id} className="pl-8">
			<div
				className="flex items-center justify-between my-2 text-black dark:text-white relative"
				onMouseEnter={() => setHoveredNote(item.id)}
				onMouseLeave={() => setHoveredNote(null)}
			>
				<Link to={`/kanban/${item.id}`} className="flex-grow">
					📊 {item.title}
				</Link>
				{hoveredNote === item.id && (
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

	if (loading) {
		return <div>Loading...</div>;
	}

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
								<button
									className="text-gray-600 dark:text-gray-400"
									onClick={kanban}
								>
									<span className="text-sm font-bold text-black dark:text-white ml-1">
										📊 カンバン
									</span>
								</button>
								<button
									className="text-gray-600 dark:text-gray-400"
									onClick={addKanban}
								>
									<FontAwesomeIcon icon={faPlusSquare} />
								</button>
							</div>
						</li>
						{(kanbans && kanbans.length > 0) ??
							kanbans.map(renderKanbanItem)}
						<li className="mt-2">
							<div className="flex items-center justify-between w-full p-4">
								<span className="text-sm font-bold text-black dark:text-white ml-1">
									🌟お気に入り
								</span>
							</div>
						</li>
						{favoriteNotes
							.filter((item) => item.favorite)
							.map((item) => renderNoteItem(item, true))}
						<li className="mt-2">
							<div className="flex items-center justify-between w-full p-4">
								<span className="text-sm font-bold text-black dark:text-white ml-1">
									👤プライベート
								</span>
								<button
									className="text-gray-600 dark:text-gray-400"
									onClick={addNote}
								>
									<FontAwesomeIcon icon={faPlusSquare} />
								</button>
							</div>
						</li>
						{sortedNotes.map((item) => renderNoteItem(item))}
					</ul>
				</div>
			</div>
			{openDropdown && (
				<DropdownMenu
					noteId={openDropdown}
					position={dropdownPosition}
					onClose={() => setOpenDropdown(null)}
					onDelete={handleDeleteNote}
				/>
			)}
		</>
	);
};

export default Sidebar;
