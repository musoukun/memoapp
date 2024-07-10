import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
<<<<<<< HEAD
import { Kanban } from "../../types/kanban";
import { AxiosResponse } from "axios";
=======
import { Kanban, KanbanColumn } from "../../types/kanban";
import { v4 as uuidv4 } from "uuid";
import { userKanbansAtom } from "../../atoms/kanbanAtom";
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)

const Sidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
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

	const [hoveredNote, setHoveredNote] = useState<string | null>(null);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
	const [userKanbans, setUserKanbans] =
		useRecoilState<Kanban[]>(userKanbansAtom);
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [selectedKanbanId, setSelectedKanbanId] = useState<string | null>(
		null
	);

	const [hoveredKanban, setHoveredKanban] = useState<string | null>(null);
	const [openKanbanDropdown, setOpenKanbanDropdown] = useState<string | null>(
		null
	);
	const [kanbanDropdownPosition, setKanbanDropdownPosition] = useState({
		x: 0,
		y: 0,
	});

	const [kanbans, setKanbans] = useState<Kanban[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
<<<<<<< HEAD
		const fetchData = async () => {
			try {
				setLoading(true);
				const notesResponse = await noteApi.getAll();
				setNotes(notesResponse.data);

				const kanbansResponse: AxiosResponse<Kanban[]> =
					await kanbanApi.getUserKanbans();
				setKanbans(kanbansResponse.data);
=======
		const fetchKanbans = async () => {
			try {
				const response = await kanbanApi.getKanbans();
				setUserKanbans(response.data);
			} catch (error) {
				console.error("Failed to fetch kanbans:", error);
			}
		};
		const fetchNotes = async () => {
			try {
				// ユーザに紐づくNoteの一覧を取得するAPI呼び出し
				const response = await noteApi.getAll();
				setNotes(response.data);
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setLoading(false);
			}
		};

<<<<<<< HEAD
		fetchData();
	}, [setNotes, setKanbans]);
=======
		fetchKanbans();
		fetchNotes();
	}, []);

	useEffect(() => {
		const noteId = location.pathname.split("/").pop();
		if (noteId && noteId !== "note") {
			setSelectedNoteId(noteId);
		} else {
			setSelectedNoteId(null);
		}
	}, [location]);

	const addKanban = async () => {
		const columns: KanbanColumn[] = [
			{ id: uuidv4(), title: "未着手", cards: [] },
			{ id: uuidv4(), title: "進行中", cards: [] },
			{ id: uuidv4(), title: "完了", cards: [] },
		];

		try {
			const newKanban = { title: "新しいカンバン", columns: columns };
			const response = await kanbanApi.create(newKanban);
			setUserKanbans([...userKanbans, response.data]);
			navigate(`/kanban/${response.data.id}`);
		} catch (error) {
			console.error("Failed to add kanban:", error);
		}
	};
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)

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
			const index = sortedNotes.findIndex((note) => note.id === id);
			const updatedNotes = sortedNotes.filter((note) => note.id !== id);
			setNotes(updatedNotes);
			setOpenDropdown(null);

			// 削除されたノートの前後のノートを検索
			const prevNoteId = updatedNotes[index - 1]?.id;
			const nextNoteId = updatedNotes[index]?.id;

			// 前後のノートに基づいてナビゲート
			if (prevNoteId) {
				navigate(`/note/${prevNoteId}`);
			} else if (nextNoteId) {
				navigate(`/note/${nextNoteId}`);
			} else {
				navigate("/");
			}
		} catch (error) {
			console.error("Failed to delete note:", error);
		}
	};
	const renderNoteItem = (item: any = false) => (
		<li
			key={item.id}
			className={`pl-8 ${selectedNoteId === item.id ? "bg-gray-200 dark:bg-gray-700" : ""}`}
		>
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

<<<<<<< HEAD
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

=======
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
	const kanban = async () => {
		try {
			navigate(`/kanban`);
		} catch (err: any) {
			alert(err.status + ": " + err.statusText);
		}
	};

<<<<<<< HEAD
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
=======
	const handleKanbanClick = (kanbanId: string) => {
		setSelectedKanbanId(kanbanId);
	};

	const handleDeleteKanban = async (id: string) => {
		try {
			await kanbanApi.delete(id);
			const updatedKanbans = userKanbans.filter(
				(kanban) => kanban.id !== id
			);
			setUserKanbans(updatedKanbans);
			setOpenKanbanDropdown(null);
			if (selectedKanbanId === id) {
				setSelectedKanbanId(null);
				navigate("/kanban");
			}
		} catch (error) {
			console.error("Failed to delete kanban:", error);
		}
	};

	const renderKanbanItem = (kanban: Kanban) => (
		<li
			key={kanban.id}
			className={`pl-8 ${selectedKanbanId === kanban.id ? "bg-gray-200 dark:bg-gray-700" : ""}`}
			onClick={() => handleKanbanClick(kanban.id)}
			onMouseEnter={() => setHoveredKanban(kanban.id)}
			onMouseLeave={() => setHoveredKanban(null)}
		>
			<div className="flex items-center justify-between my-2 text-black dark:text-white relative">
				<Link to={`/kanban/${kanban.id}`} className="flex-grow">
					🗂 {kanban.title}
				</Link>
				{hoveredKanban === kanban.id && (
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
					<button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							const rect =
								e.currentTarget.getBoundingClientRect();
<<<<<<< HEAD
							setDropdownPosition({
								x: rect.right,
								y: rect.bottom,
							});
							setOpenDropdown(
								openDropdown === item.id ? null : item.id
=======
							setKanbanDropdownPosition({
								x: rect.right,
								y: rect.bottom,
							});
							setOpenKanbanDropdown(
								openKanbanDropdown === kanban.id
									? null
									: kanban.id
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
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

<<<<<<< HEAD
	if (loading) {
		return <div>Loading...</div>;
	}

=======
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
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
<<<<<<< HEAD
								<button
									className="text-gray-600 dark:text-gray-400"
									onClick={kanban}
								>
									<span className="text-sm font-bold text-black dark:text-white ml-1">
										📊 カンバン
=======
								<button onClick={kanban}>
									<span className="text-sm font-bold text-black dark:text-white ml-1">
										📋カンバン
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
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
<<<<<<< HEAD
						{(kanbans && kanbans.length > 0) ??
							kanbans.map(renderKanbanItem)}
=======
						{userKanbans.map((kanban) => renderKanbanItem(kanban))}
>>>>>>> 32d9c58 (カンバン機能の立て直し、設計と実装をすべてやり直した。残りは永続化のみ)
						<li className="mt-2">
							<div className="flex items-center justify-between w-full p-4">
								<span className="text-sm font-bold text-black dark:text-white ml-1">
									🌟お気に入り
								</span>
							</div>
						</li>
						{favoriteNotes
							.filter((item) => item.favorite)
							.map((item) => renderNoteItem(item))}
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
			{openKanbanDropdown && (
				<DropdownMenu
					noteId={openKanbanDropdown}
					position={kanbanDropdownPosition}
					onClose={() => setOpenKanbanDropdown(null)}
					onDelete={handleDeleteKanban}
				/>
			)}
		</>
	);
};

export default Sidebar;
