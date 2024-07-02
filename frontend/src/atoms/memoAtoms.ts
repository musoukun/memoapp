import { atom, selector } from "recoil";
import { Memo } from "../types/api";

// Memo一覧の状態を表すatom
export const memosStateAtom = atom<Array<Memo>>({
	key: "memosState",
	default: [], // Change the default value to an empty array
});

// メモの状態を表すatom
export const memoStateAtom = atom<Memo>({
	key: "memoState",
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
export const createMemoflgAtom = atom<boolean>({
	key: "createMemoflg",
	default: false,
});

// メモ更新フラグのatom
export const updateMemoflgAtom = atom<boolean>({
	key: "updateMemoflg",
	default: false,
});

// メモ削除フラグのatom
export const deleteMemoflgAtom = atom<boolean>({
	key: "delete",
	default: false,
});

export const updateProgressAtom = atom<boolean>({
	key: "updateProgress",
	default: false,
});

// メモの並び替えフラグのatom
export const sortedMemosSelector = selector({
	key: "sortedMemosSelector",
	get: ({ get }) => {
		const memos = get(memosStateAtom);
		return [...memos].sort((a, b) => a.position - b.position);
	},
});
// お気に入りのメモの状態を表すatom
export const favoriteMemosSelector = selector({
	key: "favoriteMemosSelector",
	get: ({ get }) => {
		const memos = get(sortedMemosSelector);
		return memos.filter((memo) => memo.favorite);
	},
});
