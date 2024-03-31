import { atom } from "recoil";
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
