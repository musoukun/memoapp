import { atom, selector } from "recoil";
import { Note } from "../types/api";

// Note一覧の状態を表すatom
export const notesStateAtom = atom<Array<Note>>({
	key: "notesState",
	default: [], // Change the default value to an empty array
});

// メモの状態を表すatom
export const noteStateAtom = atom<Note>({
	key: "noteState",
	default: {
		title: "",
		description: "",
		icon: "",
		favorite: false,
		position: 0,
		favoritePosition: 0,
		createdAt: "",
		updatedAt: "",
	},
});

// メモ作成フラグのatom
export const createNoteflgAtom = atom<boolean>({
	key: "createNoteflg",
	default: false,
});

// メモ更新フラグのatom
export const updateNoteflgAtom = atom<boolean>({
	key: "updateNoteflg",
	default: false,
});

// メモ削除フラグのatom
export const deleteNoteflgAtom = atom<boolean>({
	key: "delete",
	default: false,
});

export const updateProgressAtom = atom<boolean>({
	key: "updateProgress",
	default: false,
});

// メモの並び替えフラグのatom
export const sortedNotesSelector = selector({
	key: "sortedNotesSelector",
	get: ({ get }) => {
		const notes = get(notesStateAtom);
		return [...notes].sort((a, b) => a.position - b.position);
	},
});
// お気に入りのメモの状態を表すatom
export const favoriteNotesSelector = selector({
	key: "favoriteNotesSelector",
	get: ({ get }) => {
		const notes = get(sortedNotesSelector);
		return notes.filter((note) => note.favorite);
	},
});
